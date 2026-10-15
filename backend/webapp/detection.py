"""
Spam and malware detection logic for the SecureGuard backend.
"""

from pathlib import Path
import re
from typing import Optional

import joblib

from models import DetectionResult, DetectionDetails


MODEL_DIR = Path(__file__).resolve().parents[2] / 'data' / 'trained_models'
SPAM_MODEL_PATH = MODEL_DIR / 'spam_detector.joblib'

_spam_model = None
_spam_model_loaded = False
_spam_model_load_error: Optional[str] = None


# Detection Patterns
SPAM_PATTERNS = [
    r'\b(win|winner|won|prize|claim|free money|lottery|million dollars)\b',
    r'\b(click here|act now|limited time|urgent|expire)\b',
    r'\b(viagra|cialis|pharmacy|pills)\b',
    r'\b(nigerian prince|inheritance|bank transfer)\b',
    r'\b(verify account|suspended|confirm identity)\b',
]

MALWARE_PATTERNS = [
    r'\.exe\b',
    r'\.bat\b',
    r'\.vbs\b',
    r'\.scr\b',
    r'<script[\s\S]*?>[\s\S]*?</script>',
    r'eval\(',
    r'base64',
]

SUSPICIOUS_URL_PATTERNS = [
    r'bit\.ly',
    r'tinyurl',
    r'goo\.gl',
    r'http://',  # Non-HTTPS
]

TEXT_LIKE_EXTENSIONS = {
    '.txt',
    '.html',
    '.htm',
    '.js',
    '.vbs',
    '.ps1',
    '.bat',
    '.cmd',
    '.py',
    '.sh',
    '.svg',
    '.xml',
    '.json',
    '.csv',
}


def apply_model_compatibility_fixes(model):
    """Patch persisted sklearn objects when minor version differences remove attrs."""
    try:
        final_estimator = model.steps[-1][1] if hasattr(model, 'steps') and model.steps else model
        if final_estimator.__class__.__name__ == 'LogisticRegression' and not hasattr(final_estimator, 'multi_class'):
            final_estimator.multi_class = 'auto'
    except Exception:
        # If compatibility inspection itself fails, the inference path will still fall back safely.
        pass

    return model


def load_spam_model():
    """Load the trained spam pipeline once and reuse it across requests."""
    global _spam_model, _spam_model_loaded, _spam_model_load_error

    if _spam_model_loaded:
        return _spam_model

    _spam_model_loaded = True
    try:
        _spam_model = apply_model_compatibility_fixes(joblib.load(SPAM_MODEL_PATH))
    except Exception as exc:  # pragma: no cover - fallback path depends on host env
        _spam_model_load_error = str(exc)
        _spam_model = None

    return _spam_model


def apply_regex_patterns(patterns, text: str, base_score: int, prefix: str):
    """Find regex matches, produce evidence strings, and return cumulative score."""
    score = 0
    findings = []
    for pattern in patterns:
        for match in re.finditer(pattern, text, re.IGNORECASE):
            score += base_score
            findings.append(f'{prefix}: "{match.group()}"')
    return score, findings


def score_to_threat_level(score: int, thresholds):
    """Map numeric risk score to threat-level labels using descending thresholds."""
    for cutoff, label in thresholds:
        if score >= cutoff:
            return label
    return 'safe'


def to_probability_score(value: float) -> int:
    """Convert a probability into a 0-100 integer score."""
    return max(0, min(100, int(round(value * 100))))


def decode_text_content(file_name: str, file_type: str, file_content: bytes) -> str:
    """Best-effort decode for uploaded files that are likely to contain text."""
    extension = Path(file_name).suffix.lower()
    is_text_type = file_type.startswith('text/')

    if not is_text_type and extension not in TEXT_LIKE_EXTENSIONS:
        return ''

    return file_content[:200_000].decode('utf-8', errors='ignore')


def analyze_text_content(text: str) -> DetectionResult:
    """
    Analyze text content for spam and malware patterns
    
    Args:
        text: Text content to analyze
        
    Returns:
        DetectionResult with analysis results
    """
    global _spam_model, _spam_model_load_error

    reasons = []
    suspicious_patterns = []
    risk_factors = []
    heuristic_spam_score = 0
    malware_score = 0

    spam_delta, spam_findings = apply_regex_patterns(
        SPAM_PATTERNS,
        text,
        base_score=20,
        prefix='Spam keyword detected',
    )
    malware_delta, malware_findings = apply_regex_patterns(
        MALWARE_PATTERNS,
        text,
        base_score=25,
        prefix='Malicious pattern detected',
    )
    heuristic_spam_score += spam_delta
    malware_score += malware_delta
    suspicious_patterns.extend(spam_findings)
    suspicious_patterns.extend(malware_findings)
    
    # Check for suspicious URLs
    for pattern in SUSPICIOUS_URL_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            heuristic_spam_score += 15
            malware_score += 10
            risk_factors.append('Contains suspicious or shortened URLs')
            break
    
    # Distinguish natural-language spam from script/code payloads so malware analysis
    # is not distorted by spam-specific heuristics or model inference.
    letters_only = [c for c in text if c.isalpha()]
    uppercase_letters = [c for c in text if c.isupper()]
    upper_ratio = (len(uppercase_letters) / len(letters_only)) if letters_only else 0.0
    looks_like_code = bool(
        re.search(r'<script|eval\(|atob\(|fromcharcode|powershell|cmd\.exe|[A-Za-z0-9+/]{40,}={0,2}', text, re.IGNORECASE)
    )

    if not looks_like_code and len(letters_only) > 20 and upper_ratio > 0.45:
        heuristic_spam_score += 15
        risk_factors.append('Excessive use of capital letters')
    
    # Check for excessive exclamation marks
    exclamation_count = text.count('!')
    if exclamation_count > 3:
        heuristic_spam_score += 10
        risk_factors.append('Multiple exclamation marks (common in spam)')
    
    # Check for money symbols
    if re.search(r'\$\d+|\d+\s*(dollars|USD|EUR|GBP)', text, re.IGNORECASE):
        heuristic_spam_score += 10
        risk_factors.append('Contains monetary amounts')

    use_spam_model = not looks_like_code and malware_score == 0
    spam_model = load_spam_model() if use_spam_model else None
    spam_probability = 0.0
    model_confidence = 0.0

    if spam_model is not None:
        try:
            probabilities = spam_model.predict_proba([text])[0]
            spam_probability = float(probabilities[1])
            model_confidence = max(spam_probability, 1.0 - spam_probability)
        except Exception as exc:
            _spam_model_load_error = f'Model inference failed: {exc}'
            _spam_model = None
            spam_model = None

    if spam_model is None:
        heuristic_probability = min(heuristic_spam_score, 100) / 100
        spam_probability = heuristic_probability
        model_confidence = heuristic_probability
        if use_spam_model and _spam_model_load_error:
            risk_factors.append('Trained spam model unavailable; using heuristic fallback')

    spam_score = to_probability_score(spam_probability)
    total_score = max(spam_score, malware_score)
    is_spam = spam_probability >= 0.5
    is_malware = malware_score >= 30
    confidence = max(model_confidence, min(malware_score, 100) / 100)

    threat_level = score_to_threat_level(
        total_score,
        thresholds=[
            (80, 'critical'),
            (60, 'high'),
            (40, 'medium'),
            (20, 'low'),
        ],
    )
    
    if is_spam and is_malware:
        reasons.append('Message mixes spam/phishing language with malicious code indicators')
    elif is_spam:
        reasons.append('Message shows strong spam or phishing characteristics')
    elif is_malware:
        reasons.append('Content contains malicious code patterns')

    if spam_findings:
        reasons.append('Urgency, prize, or account-verification language was detected')
    if malware_findings:
        reasons.append('Embedded script or executable indicators were detected')
    if suspicious_patterns:
        reasons.append('Multiple suspicious patterns were detected during analysis')
    if risk_factors:
        reasons.append('Contains several risk factors')
    if spam_model is not None:
        if is_spam:
            risk_factors.append(f'Model spam probability: {spam_score}%')
        elif not is_malware:
            reasons.append('Trained spam model classified the text as safe')
            risk_factors.append(f'Model safe confidence: {to_probability_score(1.0 - spam_probability)}%')
    if not is_spam and not is_malware and total_score == 0:
        reasons.append('No spam or malware indicators were detected')
    if not is_spam and not is_malware:
        reasons.append('Content appears safe')
    
    return DetectionResult(
        isSpam=is_spam,
        isMalware=is_malware,
        confidence=confidence,
        threatLevel=threat_level,
        reasons=reasons,
        details=DetectionDetails(
            suspiciousPatterns=suspicious_patterns,
            riskFactors=risk_factors,
            safetyScore=max(0, 100 - total_score)
        )
    )


def analyze_file_metadata(
    file_name: str,
    file_size: int,
    file_type: str,
    file_content: Optional[bytes] = None,
) -> DetectionResult:
    """
    Analyze file metadata for malware indicators
    
    Args:
        file_name: Name of the file
        file_size: Size of the file in bytes
        file_type: MIME type of the file
        
    Returns:
        DetectionResult with analysis results
    """
    reasons = []
    suspicious_patterns = []
    risk_factors = []
    malware_score = 0
    
    # Dangerous file extensions
    dangerous_extensions = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.js', '.jar', '.msi', '.dll', '.sys']
    suspicious_extensions = ['.zip', '.rar', '.7z', '.iso', '.tar', '.gz']
    
    lower_filename = file_name.lower()
    
    # Check file extension
    for ext in dangerous_extensions:
        if lower_filename.endswith(ext):
            malware_score += 50
            file_ext = file_name.split('.')[-1] if '.' in file_name else 'unknown'
            suspicious_patterns.append(f'Dangerous file extension: {file_ext}')
            reasons.append('File type is commonly used for malware distribution')
            break
    
    if malware_score == 0:  # Only check suspicious if not already dangerous
        for ext in suspicious_extensions:
            if lower_filename.endswith(ext):
                malware_score += 20
                risk_factors.append('Compressed file - may contain hidden threats')
                break
    
    # Check file size (50MB threshold)
    if file_size > 50_000_000:
        risk_factors.append('Large file size - scan recommended')
        malware_score += 10
    
    # Check for double extensions
    extension_count = file_name.count('.')
    if extension_count > 1:
        malware_score += 25
        suspicious_patterns.append('Multiple file extensions detected (possible disguise)')
    
    # Check for suspicious file names
    suspicious_keywords = ['invoice', 'receipt', 'order', 'payment', 'urgent', 'important', 'document']
    if any(keyword in lower_filename for keyword in suspicious_keywords):
        malware_score += 15
        risk_factors.append('Filename uses common phishing keywords')

    if file_content:
        if file_content.startswith(b'MZ'):
            malware_score += 35
            suspicious_patterns.append('Executable file header detected')
            reasons.append('Uploaded file contains an executable signature')

        if file_content.startswith(b'PK\x03\x04') and not any(
            lower_filename.endswith(ext) for ext in suspicious_extensions
        ):
            malware_score += 10
            risk_factors.append('Archive signature detected despite non-archive filename')

        decoded_content = decode_text_content(file_name, file_type, file_content)
        if decoded_content:
            script_score, script_findings = apply_regex_patterns(
                MALWARE_PATTERNS,
                decoded_content,
                base_score=20,
                prefix='Malicious content pattern detected',
            )
            malware_score += script_score
            suspicious_patterns.extend(script_findings)

            if re.search(r'powershell|wscript|cmd\.exe|downloadstring', decoded_content, re.IGNORECASE):
                malware_score += 20
                risk_factors.append('Script content includes execution or download commands')

            if '<script' in decoded_content.lower() and file_type.startswith('text/'):
                risk_factors.append('Text file embeds script content')
    
    # Calculate results
    total_score = malware_score
    is_malware = malware_score >= 40
    confidence = min(total_score, 100) / 100
    
    # Determine threat level
    threat_level = score_to_threat_level(
        total_score,
        thresholds=[
            (70, 'critical'),
            (50, 'high'),
            (30, 'medium'),
            (15, 'low'),
        ],
    )
    
    # Generate reasons
    if is_malware:
        reasons.append('File exhibits malicious characteristics')
    if not suspicious_patterns and not risk_factors:
        reasons.append('File appears to be safe')
        reasons.append('No malicious patterns detected')
    
    return DetectionResult(
        isSpam=False,
        isMalware=is_malware,
        confidence=confidence,
        threatLevel=threat_level,
        reasons=reasons,
        details=DetectionDetails(
            suspiciousPatterns=suspicious_patterns,
            riskFactors=risk_factors,
            safetyScore=max(0, 100 - total_score)
        )
    )
