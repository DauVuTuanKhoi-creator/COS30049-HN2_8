import { useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { analyzeFile, analyzeText } from '../../utils/detection';
import { ScanExamples } from '../../components/ScanExamples';
import { Icon, icons } from './icons';
import { mapDetectionToDashboardResult } from './helpers';
import type { DashboardScanResult } from './types';
import { LIVE_SCAN_UPDATED_EVENT } from './liveTelemetry';

// Scanner page encapsulates all scan workflows (text/file) and presents unified results.
export default function ScannerPage(): ReactElement {
  // Scanner state is shared between tab modes so users can switch context without losing progress.
  const [scanText, setScanText] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<DashboardScanResult | null>(null);
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // This adapter keeps page rendering decoupled from the backend DetectionResult schema.
  const applyScanResult = (detection: Awaited<ReturnType<typeof analyzeText>>) => {
    setScanResult(mapDetectionToDashboardResult(detection));
  };

  // Shared async handler keeps text and file scan branches consistent.
  const runScan = async (mode: 'text' | 'file', payload: string | File) => {
    setScanning(true);
    setScanResult(null);

    try {
      const detection = mode === 'file' ? await analyzeFile(payload as File) : await analyzeText(payload as string);
      applyScanResult(detection);
      // Notify telemetry consumers (overview/history) to fetch fresh persisted history immediately.
      window.dispatchEvent(new Event(LIVE_SCAN_UPDATED_EVENT));
    } catch (error) {
      console.error('Dashboard scanner error:', error);
      setScanResult({
        level: 'malware',
        score: 0,
        details: 'Scanner service unavailable. Please retry in a moment.',
        flags: [],
      });
    } finally {
      setScanning(false);
    }
  };

  const handleScan = async () => {
    const hasText = scanText.trim().length > 0;
    if (!hasText && !selectedFile) return;

    if (activeTab === 'file' && selectedFile) {
      await runScan('file', selectedFile);
      return;
    }

    await runScan('text', scanText);
  };

  const handleExampleScan = (content: string) => {
    // Load the sample into the text box, but wait for explicit user confirmation.
    setScanText(content);
    setActiveTab('text');
    setScanResult(null);
  };

  return (
    <div className="fade-up scanner-page">
      <div className="page-header">
        <h1 className="page-title">AI Scanner</h1>
        <p className="page-subtitle">Analyze text or files for spam, malware, and phishing threats</p>
      </div>

      <div className="card card-pad-lg scanner-card">
        <div className="tab-row">
          <button
            className={`tab ${activeTab === 'text' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('text');
              setScanResult(null);
            }}
          >
            Text Analysis
          </button>
          <button
            className={`tab ${activeTab === 'file' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('file');
              setScanResult(null);
            }}
          >
            File Scanner
          </button>
        </div>

        {activeTab === 'text' ? (
          <>
            <label className="field-label">Paste Content to Analyze</label>
            <textarea
              rows={8}
              value={scanText}
              onChange={(e) => setScanText(e.target.value)}
              placeholder="Paste your email or message content here..."
              className="scanner-textarea"
            />
            <div className="scanner-examples">
              <ScanExamples onSelectExample={handleExampleScan} isLoading={scanning} disabled={activeTab !== 'text'} />
            </div>
          </>
        ) : (
          <>
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              title="Choose a file to scan"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setSelectedFile(file);
                setScanResult(null);
              }}
            />
            <div className="drop-zone" onClick={() => fileRef.current?.click()}>
              <div className="drop-icon">FILE</div>
              <div className="drop-title">Drop files here or click to browse</div>
              <div className="drop-subtitle">Supports common text, email, and document formats</div>
              {selectedFile && <div className="drop-loaded">Loaded: {selectedFile.name}</div>}
            </div>
          </>
        )}

        <button className="scan-btn" onClick={handleScan} disabled={scanning || (!scanText.trim() && !selectedFile)}>
          {scanning ? (
            <>
              <div className="spinner" />
              Analyzing...
            </>
          ) : (
            <>
              <Icon d={icons.scan} size={18} />
              Scan Now
            </>
          )}
        </button>
      </div>

      {scanResult && (
        <div className={`card card-pad-lg scan-result scan-result-${scanResult.level}`}>
          <div className="scan-result-header">
            <div className={`scan-result-icon level-${scanResult.level}`}>
              <span>{scanResult.level === 'clean' ? 'OK' : scanResult.level === 'spam' ? 'SP' : scanResult.level === 'malware' ? 'MW' : 'PH'}</span>
            </div>
            <div className="scan-result-main">
              <div className="scan-result-title-row">
                <strong className="scan-result-level">{scanResult.level}</strong>
                <span className={`badge badge-${scanResult.level}`}>{scanResult.level.toUpperCase()}</span>
              </div>
              <p className="scan-result-details">{scanResult.details}</p>
            </div>
            <div className="scan-score-box">
              <div className="scan-score-value">{scanResult.score}%</div>
              <div className="scan-score-label">safety score</div>
            </div>
          </div>

          <div className="progress-bar">
            <progress className={`scan-progress scan-progress-${scanResult.level}`} max={100} value={scanResult.score} />
          </div>

          {scanResult.flags.length > 0 && (
            <div className="flag-wrap">
              {scanResult.flags.map((f) => (
                <span key={f} className="badge badge-danger-soft">{f}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
