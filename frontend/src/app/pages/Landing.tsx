import { analyzeText } from '../utils/detection';
import './landing.css';
import React, { useState } from 'react';
import { 
  Shield, Mail, FileSearch, Zap, Lock, Users, 
  CheckCircle, Search, AlertTriangle, Loader2, 
  Menu, ChevronRight, ShieldCheck 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';

interface ScanView {
  // View model used by landing UI so rendering stays independent from backend schema details.
  safe: boolean;
  label: string;
  score: number;
  details: string;
}

const features = [
  {
    icon: 'SP',
    title: 'Email Spam Detection',
    desc: 'Advanced ML algorithms analyze email patterns, sender reputation, and content to identify and block spam messages.',
  },
  {
    icon: 'MW',
    title: 'Malware Scanning',
    desc: 'Scan files and attachments for malicious code, trojans, and viruses before they can harm your system.',
  },
  {
    icon: 'RT',
    title: 'Real-Time Analysis',
    desc: 'Get instant results with our high-speed processing engine that analyzes threats in milliseconds.',
  },
  {
    icon: 'PF',
    title: 'Privacy First',
    desc: 'Your data is encrypted and processed securely. We never store your personal information or messages.',
  },
  {
    icon: 'MD',
    title: 'Multi-Layer Defense',
    desc: 'Multiple detection models work together to provide comprehensive protection against various threat types.',
  },
  {
    icon: 'CI',
    title: 'Community Insights',
    desc: 'Benefit from crowd-sourced threat intelligence to stay protected against the latest emerging threats.',
  },
] as const;

const stats = [
  { value: '99.9%', label: 'Accuracy Rate' },
  { value: '10M+', label: 'Threats Blocked' },
  { value: '50K+', label: 'Active Users' },
] as const;

const steps = [
  { n: '01', title: 'Upload or Paste', desc: 'Submit email text, message content, or upload files you want to scan.' },
  { n: '02', title: 'AI Analysis', desc: 'Our AI models analyze patterns, links, attachments, and content structure.' },
  { n: '03', title: 'Get Results', desc: 'Receive detailed threat assessment with confidence scores and recommendations.' },
] as const;

const ShieldIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ScanIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <line x1="7" y1="12" x2="17" y2="12" />
  </svg>
);

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const mapResultToView = (threatLevel: string, safetyScore: number, reasons: string[]): ScanView => {
  // Convert model-level threat buckets into concise, user-facing language.
  const label = threatLevel === 'safe' ? 'Clean' : threatLevel === 'low' ? 'Low Risk' : threatLevel === 'medium' ? 'Suspicious' : 'High Risk';
  return {
    safe: threatLevel === 'safe',
    label,
    score: safetyScore,
    details: reasons.length > 0 ? reasons.join(' ') : 'Analysis completed.',
  };
};

export default function Landing() {
  const { theme, setTheme } = useTheme();
  const isDark = theme !== 'light';
  // Scanner state tracks user input, in-flight status, and final rendered verdict.
  const [inputText, setInputText] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanView | null>(null);
  const [scanStatus, setScanStatus] = useState('idle'); 
  const [inputValue, setInputValue] = useState('');

  const handleScan = async () => {
    if (!inputText.trim()) return;

    // Prevent stale results from showing while a new analysis request is running.
    setScanning(true);
    setResult(null);

    try {
      const detection = await analyzeText(inputText);
      setResult(mapResultToView(detection.threatLevel, detection.details.safetyScore, detection.reasons));
    } catch (error) {
      console.error('Landing scan error:', error);
      setResult({
        safe: false,
        label: 'Scan Failed',
        score: 0,
        details: 'The scan service is temporarily unavailable. Please try again.',
      });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className={`landing-shell ${isDark ? 'landing-dark' : 'landing-light'}`}>
      <nav className="landing-nav">
        <div className="landing-header-shell">
          <div className="landing-header-top">
            <a href="#top" className="landing-brand-link">
              <div className="landing-brand-icon-wrap">
                <ShieldIcon size={30} />
              </div>
              <span className="landing-brand-text">SecureGuard</span>
            </a>

            <div className="landing-auth-links">
              <Link to="/signin" className="landing-nav-link">Login</Link>
              <Link to="/signup" className="landing-btn-primary landing-btn-primary-small">Get Started</Link>
            </div>
          </div>

          <div className="landing-header-bottom">
            <div className="landing-menu-links">
              <Link to="/product" className="landing-menu-link">PRODUCT</Link>
              <Link to="/company" className="landing-menu-link">COMPANY</Link>
              <Link to="/resources" className="landing-menu-link">RESOURCES</Link>
            </div>

            <button className="landing-theme-toggle" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
              {isDark ? <SunIcon /> : <MoonIcon />} {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </nav>

      <section id="top" className="landing-hero-section landing-grid-dots">
        <div className="landing-bg-orb landing-bg-orb-a" />
        <div className="landing-bg-orb landing-bg-orb-b" />

        <div className="landing-hero-grid">
          <div className="landing-hero-left fade-up">
            <div className="landing-pill">
              <div className="landing-pill-dot" />
              <span>AI-Powered Protection</span>
            </div>
            <h1 className="landing-hero-title">
              Protect Your
              <br />
              <span>Digital World</span>
              <br />
              from Threats
            </h1>
            <p className="landing-hero-copy">
              Advanced AI detection system to identify and block spam messages, malicious emails, and potential malware threats before they reach you.
            </p>
            <div className="landing-cta-row">
              <Link to="/signup" className="landing-btn-primary landing-btn-primary-large">Start Protecting Now</Link>
              <a href="#product" className="landing-btn-outline">Learn More</a>
            </div>
            <div className="landing-stats-row">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="landing-stat-value">{s.value}</div>
                  <div className="landing-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="landing-hero-right fade-up-delay">
            <div className="landing-hero-ring">
              <div className="landing-hero-ring-inner">
                <ShieldIcon size={80} />
                <div className="landing-hero-protected">PROTECTED</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-scan-section">
        <div className="landing-scan-shell">
          <div className="landing-scan-heading">
            <h2>Try Live AI Detection</h2>
            <p>Paste any email content, message, or text snippet to see spam and malware detection in action.</p>
          </div>
          <div className="landing-scan-card">
            <label className="landing-scan-label">Analyze Text Content</label>
            <p className="landing-scan-subcopy">Paste email content, messages, or any suspicious text to scan for spam and malware patterns</p>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your email or message content here..."
              className="landing-scan-textarea"
            />
            <button className="landing-scan-btn" onClick={handleScan} disabled={scanning || !inputText.trim()}>
              {scanning ? <span className="landing-spinner" /> : <ScanIcon />}
              {scanning ? 'Scanning...' : 'Scan Text'}
            </button>
            {result && (
              <div className={`landing-result-card ${result.safe ? 'landing-result-safe' : 'landing-result-risk'}`}>
                <div className="landing-result-row">
                  <div className={`landing-result-icon ${result.safe ? 'landing-result-icon-safe' : 'landing-result-icon-risk'}`}>{result.safe ? 'OK' : '!'}</div>
                  <div>
                    <div className={`landing-result-title ${result.safe ? 'landing-result-title-safe' : 'landing-result-title-risk'}`}>{result.label}</div>
                    <div className="landing-result-meta">Safety score: {result.score}%</div>
                  </div>
                  <div className="landing-result-score-wrap">
                    <div className={`landing-result-score ${result.safe ? 'landing-result-title-safe' : 'landing-result-title-risk'}`}>{result.score}%</div>
                    <div className="landing-result-meta">confidence</div>
                  </div>
                </div>
                <div className="landing-result-progress">
                      <progress className={`landing-result-progress-fill ${result.safe ? 'landing-result-progress-safe' : 'landing-result-progress-risk'}`} max={100} value={result.score} />
                </div>
                <p className="landing-result-copy">{result.details}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="product" className="landing-feature-section">
        <div className="landing-container">
          <div className="landing-section-heading">
            <div className="landing-section-kicker">Features</div>
            <h2>Comprehensive Protection</h2>
            <p>Everything you need to stay safe from digital threats</p>
          </div>
          <div className="landing-feature-grid">
            {features.map((f) => (
              <div key={f.title} className="landing-feature-card">
                <div className="landing-feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="company" className="landing-process-section">
        <div className="landing-process-shell">
          <div className="landing-section-heading">
            <div className="landing-section-kicker">Process</div>
            <h2>How It Works</h2>
            <p>Simple, fast, and effective threat detection</p>
          </div>
          <div className="landing-steps-grid">
            <div className="landing-steps-line" />
            {steps.map((s) => (
              <div key={s.n} className="landing-step-card">
                <div className="landing-step-badge">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-cta-section">
        <div className="landing-container">
          <div className="landing-cta-card">
            <div className="landing-cta-orb landing-cta-orb-a" />
            <div className="landing-cta-orb landing-cta-orb-b" />
            <h2>Ready to Secure Your Communications?</h2>
            <p>Join thousands of users protecting themselves from digital threats</p>
            <Link to="/signup" className="landing-btn-white">Create Free Account</Link>
          </div>
        </div>
      </section>

      <footer id="resources" className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer-grid">
            <div>
              <div className="landing-footer-brand">
                <ShieldIcon size={22} />
                <span>SecureGuard</span>
              </div>
              <p className="landing-footer-copy">Advanced spam and malware detection to keep your digital life secure.</p>
            </div>
            <div>
              <h4 className="mb-4 text-slate-950 dark:text-white">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><Link to="/features" className="hover:text-slate-950 dark:hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-slate-950 dark:hover:text-white">Pricing</Link></li>
                <li><Link to="/security" className="hover:text-slate-950 dark:hover:text-white">Security</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4 text-slate-950 dark:text-white">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="/about" className="hover:text-slate-950 dark:hover:text-white">About</a></li>
                <li><a href="/blog" className="hover:text-slate-950 dark:hover:text-white">Blog</a></li>
                <li><a href="/careers" className="hover:text-slate-950 dark:hover:text-white">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4 text-slate-950 dark:text-white">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><Link to="/docs" className="hover:text-slate-950 dark:hover:text-white">Docs</Link></li>
                <li><Link to="/tutorials" className="hover:text-slate-950 dark:hover:text-white">Tutorials</Link></li>
                <li><Link to="/api-reference" className="hover:text-slate-950 dark:hover:text-white">API Reference</Link></li>
              </ul>
            </div>
          </div>
          <div className="landing-footer-bottom">2026 SecureGuard. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
