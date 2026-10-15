import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import type { ThreatLevel } from './types';
import { useLiveTelemetry } from './liveTelemetry';

// History page provides scan traceability with simple severity filtering.
export default function HistoryPage(): ReactElement {
  const [historyFilter, setHistoryFilter] = useState<'all' | ThreatLevel>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const {
    records,
    lastUpdated,
    loadingLiveData,
    refreshError,
    refreshFromApi,
  } = useLiveTelemetry({ autoRefresh, refreshEverySec: 20 });

  const filteredHistory = useMemo(
    () => (historyFilter === 'all' ? records : records.filter((record) => record.level === historyFilter)),
    [historyFilter, records],
  );

  return (
    <div className="fade-up">
      <div className="page-header">
        <h1 className="page-title">Scan History</h1>
        <p className="page-subtitle">{filteredHistory.length} records</p>
      </div>

      <div className="analytics-toolbar card card-pad-md">
        <div className="analytics-controls-left">
          <label className="live-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(event) => setAutoRefresh(event.target.checked)}
            />
            Live Auto-Refresh
          </label>
          <button className="btn btn-ghost" onClick={() => void refreshFromApi()} disabled={loadingLiveData}>
            {loadingLiveData ? 'Refreshing...' : 'Refresh Now'}
          </button>
        </div>

        <div className="analytics-controls-right">
          <div className="live-status-row">
            <span className={`live-pill ${autoRefresh ? 'on' : 'off'}`}>{autoRefresh ? 'LIVE' : 'PAUSED'}</span>
            <span className="last-updated-text">
              Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'waiting for first refresh'}
            </span>
          </div>
        </div>
      </div>
      {refreshError && <p className="history-meta">{refreshError}</p>}

      <div className="tab-row tab-row-wrap">
        {(['all', 'clean', 'spam', 'phishing', 'malware'] as const).map((filterName) => (
          <button
            key={filterName}
            className={`tab ${historyFilter === filterName ? 'active' : ''}`}
            onClick={() => setHistoryFilter(filterName)}
          >
            {filterName}
          </button>
        ))}
      </div>

      <div className="stack-sm">
        {filteredHistory.map((record) => (
          <div key={record.id} className="history-row">
            <div className={`level-badge level-${record.level}`}>
              <span className="level-emoji">{record.level === 'clean' ? 'OK' : record.level === 'spam' ? 'SP' : record.level === 'malware' ? 'MW' : 'PH'}</span>
            </div>
            <div className="history-main">
              <div className="history-preview">{record.preview}</div>
              <div className="history-meta">{record.timestamp.toLocaleDateString()} · {record.timestamp.toLocaleTimeString()}</div>
            </div>
            <span className={`badge badge-${record.level}`}>{record.level}</span>
            <span className={`history-score history-score-${record.level}`}>{record.safetyScore}%</span>
          </div>
        ))}
        {filteredHistory.length === 0 && <p className="history-meta">No records available for the current filter.</p>}
      </div>
    </div>
  );
}
