// Detection algorithms with FastAPI integration
import { apiService } from '@/app/services/api';

export interface DetectionResult {
  // High-level flags consumed by status badges and summary headers.
  isSpam: boolean;
  isMalware: boolean;
  confidence: number;
  threatLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  details: {
    // Detailed evidence displayed in expanded result views.
    suspiciousPatterns: string[];
    riskFactors: string[];
    safetyScore: number;
  };
}

// Flag to use mock data when API is unavailable
const USE_MOCK_DATA = false;

// Common spam/malware patterns for mock detection
const SPAM_PATTERNS = [
  /\b(win|winner|won|prize|claim|free money|lottery|million dollars)\b/i,
  /\b(click here|act now|limited time|urgent|expire)\b/i,
  /\b(viagra|cialis|pharmacy|pills)\b/i,
  /\b(nigerian prince|inheritance|bank transfer)\b/i,
  /\b(verify account|suspended|confirm identity)\b/i,
];

const MALWARE_PATTERNS = [
  /\.exe\b/i,
  /\.bat\b/i,
  /\.vbs\b/i,
  /\.scr\b/i,
  /<script[\s\S]*?>[\s\S]*?<\/script>/i,
  /eval\(/i,
  /base64/i,
];

const SUSPICIOUS_URLS = [
  /bit\.ly/i,
  /tinyurl/i,
  /goo\.gl/i,
  /http:\/\//i, // Non-HTTPS
];

// Mock function for text analysis
function mockAnalyzeText(text: string): DetectionResult {
  // Scores are intentionally additive so multiple weak signals can elevate overall risk.
  const reasons: string[] = [];
  const suspiciousPatterns: string[] = [];
  const riskFactors: string[] = [];
  let spamScore = 0;
  let malwareScore = 0;

  // Check for spam patterns
  SPAM_PATTERNS.forEach((pattern) => {
    if (pattern.test(text)) {
      spamScore += 20;
      const match = text.match(pattern);
      if (match) {
        suspiciousPatterns.push(`Spam keyword detected: "${match[0]}"`);
      }
    }
  });

  // Check for malware patterns
  MALWARE_PATTERNS.forEach((pattern) => {
    if (pattern.test(text)) {
      malwareScore += 25;
      const match = text.match(pattern);
      if (match) {
        suspiciousPatterns.push(`Malicious pattern detected: "${match[0]}"`);
      }
    }
  });

  // Check for suspicious URLs
  SUSPICIOUS_URLS.forEach((pattern) => {
    if (pattern.test(text)) {
      spamScore += 15;
      malwareScore += 10;
      riskFactors.push('Contains suspicious or shortened URLs');
    }
  });

  // Check for excessive caps with code-aware filtering to reduce false positives.
  const lettersOnly = text.match(/[A-Za-z]/g) || [];
  const uppercaseLetters = text.match(/[A-Z]/g) || [];
  const capsRatio = lettersOnly.length > 0 ? uppercaseLetters.length / lettersOnly.length : 0;
  const looksLikeCode = /<script|eval\(|atob\(|[A-Za-z0-9+/]{40,}={0,2}/i.test(text);

  // Only apply capitalization penalty to natural-language text, not code/base64 payloads.
  if (!looksLikeCode && capsRatio > 0.45 && lettersOnly.length > 30) {
    spamScore += 15;
    riskFactors.push('Excessive use of capital letters');
  }

  // Exclamation bursts are weighted as a spam signal, not a malware signal.
  const exclamationCount = (text.match(/!/g) || []).length;
  if (exclamationCount > 3) {
    spamScore += 10;
    riskFactors.push('Multiple exclamation marks (common in spam)');
  }

  // Monetary bait is another common spam indicator in phishing/lure messages.
  if (/\$\d+|\d+\s*(dollars|USD|EUR|GBP)/i.test(text)) {
    spamScore += 10;
    riskFactors.push('Contains monetary amounts');
  }

  // Calculate final scores
  const totalScore = Math.max(spamScore, malwareScore);
  const isSpam = spamScore >= 30;
  const isMalware = malwareScore >= 30;
  const confidence = Math.min(totalScore, 100) / 100;

  // Threat level bands are based on the max signal (spam/malware) for a conservative outcome.
  let threatLevel: DetectionResult['threatLevel'] = 'safe';
  if (totalScore >= 80) threatLevel = 'critical';
  else if (totalScore >= 60) threatLevel = 'high';
  else if (totalScore >= 40) threatLevel = 'medium';
  else if (totalScore >= 20) threatLevel = 'low';

  // Generate reasons
  if (isSpam && isMalware) reasons.push('Message mixes spam/phishing language with malicious code indicators');
  else if (isSpam) reasons.push('Message shows strong spam or phishing characteristics');
  else if (isMalware) reasons.push('Content contains malicious code patterns');

  if (suspiciousPatterns.some((pattern) => pattern.startsWith('Spam keyword detected'))) {
    reasons.push('Urgency, prize, or account-verification language was detected');
  }
  if (suspiciousPatterns.some((pattern) => pattern.startsWith('Malicious pattern detected'))) {
    reasons.push('Embedded script or executable indicators were detected');
  }
  if (suspiciousPatterns.length > 0) reasons.push('Multiple suspicious patterns were detected during analysis');
  if (riskFactors.length > 0) reasons.push('Contains several risk factors');
  if (!isSpam && !isMalware && totalScore === 0) {
    reasons.push('No spam or malware indicators were detected');
    reasons.push('Content appears safe');
  }

  return {
    isSpam,
    isMalware,
    confidence,
    threatLevel,
    reasons,
    details: {
      suspiciousPatterns,
      riskFactors,
      safetyScore: Math.max(0, 100 - totalScore),
    },
  };
}

export async function analyzeText(text: string): Promise<DetectionResult> {
  // Development toggle for running the UI without backend availability.
  if (USE_MOCK_DATA) {
    return mockAnalyzeText(text);
  }

  try {
    // Primary path: call the FastAPI endpoint for model-backed inference.
    return await apiService.analyzeText(text);
  } catch (error) {
    console.error('API text analysis failed:', error);
    throw new Error('Unable to save text scan to backend. Please sign in and verify the API is reachable.');
  }
}

// Mock function for file analysis
function mockAnalyzeFile(file: File): DetectionResult {
  // File heuristics emphasize extension and naming metadata when raw binary analysis is unavailable.
  const reasons: string[] = [];
  const suspiciousPatterns: string[] = [];
  const riskFactors: string[] = [];
  let malwareScore = 0;

  const fileName = file.name;
  const fileSize = file.size;
  const fileType = file.type;

  // Check file extension
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.js', '.jar', '.msi'];
  const suspiciousExtensions = ['.zip', '.rar', '.7z', '.iso'];
  
  const lowerFileName = fileName.toLowerCase();
  
  if (dangerousExtensions.some(ext => lowerFileName.endsWith(ext))) {
    malwareScore += 50;
    suspiciousPatterns.push(`Dangerous file extension: ${fileName.split('.').pop()}`);
    reasons.push('File type is commonly used for malware distribution');
  } else if (suspiciousExtensions.some(ext => lowerFileName.endsWith(ext))) {
    malwareScore += 20;
    riskFactors.push('Compressed file - may contain hidden threats');
  }

  // Check file size
  if (fileSize > 50000000) { // 50MB
    riskFactors.push('Large file size - scan recommended');
    malwareScore += 10;
  }

  // Check for double extensions
  const extensionCount = (fileName.match(/\./g) || []).length;
  if (extensionCount > 1) {
    malwareScore += 25;
    suspiciousPatterns.push('Multiple file extensions detected (possible disguise)');
  }

  // Check for suspicious file names
  if (/invoice|receipt|order|payment|urgent|important/i.test(fileName)) {
    malwareScore += 15;
    riskFactors.push('Filename uses common phishing keywords');
  }

  const totalScore = malwareScore;
  const isMalware = malwareScore >= 40;
  const confidence = Math.min(totalScore, 100) / 100;

  let threatLevel: DetectionResult['threatLevel'] = 'safe';
  if (totalScore >= 70) threatLevel = 'critical';
  else if (totalScore >= 50) threatLevel = 'high';
  else if (totalScore >= 30) threatLevel = 'medium';
  else if (totalScore >= 15) threatLevel = 'low';

  if (isMalware) reasons.push('File exhibits malicious characteristics');
  if (suspiciousPatterns.length === 0 && riskFactors.length === 0) {
    reasons.push('File appears to be safe');
    reasons.push('No malicious patterns detected');
  }

  return {
    isSpam: false,
    isMalware,
    confidence,
    threatLevel,
    reasons,
    details: {
      suspiciousPatterns,
      riskFactors,
      safetyScore: Math.max(0, 100 - totalScore),
    },
  };
}

export async function analyzeFile(file: File): Promise<DetectionResult> {
  // Keep behavior consistent with text scanning: API-first, mock fallback.
  if (USE_MOCK_DATA) {
    return mockAnalyzeFile(file);
  }

  try {
    // Upload the file for server-side scanning and normalized scoring.
    return await apiService.uploadFileForScan(file);
  } catch (error) {
    console.error('API file analysis failed:', error);
    throw new Error('Unable to save file scan to backend. Please sign in and verify the API is reachable.');
  }
}

export interface ScanHistory {
  id: string;
  type: 'text' | 'file';
  timestamp: Date;
  result: DetectionResult;
  preview: string;
}

// Mock scan history
function mockGetScanHistory(): ScanHistory[] {
  return [
    {
      id: '1',
      type: 'text',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      result: {
        isSpam: true,
        isMalware: false,
        confidence: 0.87,
        threatLevel: 'high',
        reasons: ['Content matches known spam patterns'],
        details: {
          suspiciousPatterns: ['Spam keyword detected: "WIN"'],
          riskFactors: ['Excessive use of capital letters'],
          safetyScore: 13,
        },
      },
      preview: 'CONGRATULATIONS! You have WON $1,000,000...',
    },
    {
      id: '2',
      type: 'file',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      result: {
        isSpam: false,
        isMalware: false,
        confidence: 0.05,
        threatLevel: 'safe',
        reasons: ['File appears to be safe'],
        details: {
          suspiciousPatterns: [],
          riskFactors: [],
          safetyScore: 95,
        },
      },
      preview: 'document.pdf',
    },
    {
      id: '3',
      type: 'text',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      result: {
        isSpam: false,
        isMalware: false,
        confidence: 0,
        threatLevel: 'safe',
        reasons: ['Content appears safe'],
        details: {
          suspiciousPatterns: [],
          riskFactors: [],
          safetyScore: 100,
        },
      },
      preview: 'Meeting scheduled for tomorrow at 2 PM',
    },
  ];
}

export async function getScanHistory(): Promise<ScanHistory[]> {
  // History retrieval follows the same mock-first development switch.
  if (USE_MOCK_DATA) {
    return mockGetScanHistory();
  }

  try {
    // Convert serialized timestamps back into Date objects for UI formatting.
    const history = await apiService.getScanHistory();
    return history.map(item => ({
      ...item,
      timestamp: new Date(item.timestamp),
    }));
  } catch (error) {
    console.error('API scan history failed:', error);
    throw new Error('Unable to load scan history from backend. Please sign in and verify the API is reachable.');
  }
}