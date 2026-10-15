import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Icon, icons } from './icons';
import type { ThreatLevel } from './types';
import { useLiveTelemetry } from './liveTelemetry';

// Register Chart.js building blocks once at module load so all chart instances can render.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin,
);

type TimeWindow = '24h' | '7d' | 'all';

const LEVEL_COLORS: Record<ThreatLevel, string> = {
  clean: '#10B981',
  spam: '#F59E0B',
  phishing: '#8B5CF6',
  malware: '#EF4444',
};

const LEVEL_ORDER: ThreatLevel[] = ['clean', 'spam', 'phishing', 'malware'];

// Toggle for demo mode: charts render stable placeholder data instead of live API-derived series.
const USE_PLACEHOLDER_CHART_DATA = true;

const PLACEHOLDER_TREND_POINTS = [78, 74, 81, 69, 72, 76, 71, 84, 79, 73, 77, 82];
const PLACEHOLDER_TREND_LABELS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
const PLACEHOLDER_LEVEL_COUNTS: Record<ThreatLevel, number> = {
  clean: 36,
  spam: 14,
  phishing: 9,
  malware: 6,
};

// Download utility for CSV/JSON snapshots used in report and data-sharing workflows.
function triggerDownload(fileName: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

// Overview bundles headline metrics and quick activity into one glanceable surface.
export default function OverviewPage(): ReactElement {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('7d');
  const [riskThreshold, setRiskThreshold] = useState(45);
  const [activeLevels, setActiveLevels] = useState<Record<ThreatLevel, boolean>>({
    clean: true,
    spam: true,
    phishing: true,
    malware: true,
  });
  const [focusedLevel, setFocusedLevel] = useState<ThreatLevel | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshEverySec, setRefreshEverySec] = useState(20);

  const {
    records,
    lastUpdated,
    loadingLiveData,
    refreshError,
    refreshFromApi,
  } = useLiveTelemetry({ autoRefresh, refreshEverySec });

  // We hold a chart ref so users can reset zoom after pan/scroll exploration.
  const trendChartRef = useRef<ChartJS<'line'> | null>(null);

  // Time-window filtering enables short-term vs medium-term risk trend analysis.
  const windowRecords = useMemo(() => {
    if (timeWindow === 'all') {
      return records;
    }

    const hours = timeWindow === '24h' ? 24 : 24 * 7;
    const cutoff = Date.now() - hours * 60 * 60 * 1000;
    return records.filter((record) => record.timestamp.getTime() >= cutoff);
  }, [records, timeWindow]);

  // Slider threshold converts model outcomes into actionable "needs attention" slices.
  const actionableRecords = useMemo(() => {
    const maxSafetyAllowed = 100 - riskThreshold;
    return windowRecords.filter((record) => record.safetyScore <= maxSafetyAllowed);
  }, [windowRecords, riskThreshold]);

  const visibleActionableRecords = useMemo(() => {
    return actionableRecords.filter((record) => {
      const levelAllowed = activeLevels[record.level];
      const focusAllowed = focusedLevel ? record.level === focusedLevel : true;
      return levelAllowed && focusAllowed;
    });
  }, [actionableRecords, activeLevels, focusedLevel]);

  const levelCounts = useMemo(() => {
    if (USE_PLACEHOLDER_CHART_DATA) {
      return PLACEHOLDER_LEVEL_COUNTS;
    }

    return LEVEL_ORDER.reduce<Record<ThreatLevel, number>>((acc, level) => {
      acc[level] = visibleActionableRecords.filter((record) => record.level === level).length;
      return acc;
    }, { clean: 0, spam: 0, phishing: 0, malware: 0 });
  }, [visibleActionableRecords]);

  const topThreatLevel = useMemo(() => {
    return LEVEL_ORDER.reduce<{ level: ThreatLevel; count: number }>(
      (winner, level) => (levelCounts[level] > winner.count ? { level, count: levelCounts[level] } : winner),
      { level: 'clean', count: levelCounts.clean },
    );
  }, [levelCounts]);

  const averageSafety = useMemo(() => {
    if (windowRecords.length === 0) {
      return 100;
    }
    const total = windowRecords.reduce((sum, record) => sum + record.safetyScore, 0);
    return Math.round(total / windowRecords.length);
  }, [windowRecords]);

  // Trend chart data: sorted time series for zoomable risk trajectory analysis.
  const trendChartData = useMemo<ChartData<'line'>>(() => {
    if (USE_PLACEHOLDER_CHART_DATA) {
      return {
        labels: PLACEHOLDER_TREND_LABELS,
        datasets: [
          {
            label: 'Safety Score',
            data: PLACEHOLDER_TREND_POINTS,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            tension: 0.3,
            fill: true,
            pointRadius: 3,
          },
        ],
      };
    }

    const sorted = [...windowRecords].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    return {
      labels: sorted.map((record) => record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
      datasets: [
        {
          label: 'Safety Score',
          data: sorted.map((record) => record.safetyScore),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          tension: 0.3,
          fill: true,
          pointRadius: 3,
        },
      ],
    };
  }, [windowRecords]);

  const threatBreakdownData = useMemo<ChartData<'bar'>>(() => {
    return {
      labels: LEVEL_ORDER.map((level) => level.toUpperCase()),
      datasets: [
        {
          label: 'Flagged Scans',
          data: LEVEL_ORDER.map((level) => levelCounts[level]),
          backgroundColor: LEVEL_ORDER.map((level) => LEVEL_COLORS[level]),
          borderRadius: 8,
        },
      ],
    };
  }, [levelCounts]);

  const distributionData = useMemo<ChartData<'doughnut'>>(() => {
    return {
      labels: LEVEL_ORDER.map((level) => level.toUpperCase()),
      datasets: [
        {
          data: LEVEL_ORDER.map((level) => levelCounts[level]),
          backgroundColor: LEVEL_ORDER.map((level) => LEVEL_COLORS[level]),
          borderColor: '#0F172A',
          borderWidth: 2,
          hoverOffset: 10,
        },
      ],
    };
  }, [levelCounts]);

  const trendOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      zoom: {
        // Users can inspect short spikes in safety-score by dragging and scrolling over the chart.
        pan: { enabled: true, mode: 'x' },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'x',
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: { stepSize: 20 },
      },
    },
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  const doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    // Clicking a donut slice toggles per-level focus, giving category drill-down interaction.
    onClick: (_, elements) => {
      if (elements.length === 0) {
        setFocusedLevel(null);
        return;
      }
      const idx = elements[0].index;
      const clicked = LEVEL_ORDER[idx];
      setFocusedLevel((current) => (current === clicked ? null : clicked));
    },
  };

  const handleExportCsv = () => {
    const header = ['id', 'timestamp', 'level', 'safetyScore', 'preview'];
    const rows = visibleActionableRecords.map((record) => [
      record.id,
      record.timestamp.toISOString(),
      record.level,
      String(record.safetyScore),
      `"${record.preview.replace(/"/g, '""')}"`,
    ]);
    const csv = [header.join(','), ...rows.map((row) => row.join(','))].join('\n');
    triggerDownload('secureguard-actionable-scans.csv', csv, 'text/csv;charset=utf-8;');
  };

  const handleExportSummary = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      timeWindow,
      riskThreshold,
      focusedLevel,
      averageSafety,
      counts: levelCounts,
      records: visibleActionableRecords,
    };
    triggerDownload('secureguard-analytics-summary.json', JSON.stringify(payload, null, 2), 'application/json');
  };

  const recentRecords = useMemo(() => {
    return [...visibleActionableRecords]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 6);
  }, [visibleActionableRecords]);

  const kpiCards = [
    { label: 'Total Scans', value: String(windowRecords.length), icon: icons.scan, tone: 'accent' },
    { label: 'Threats Flagged', value: String(actionableRecords.length), icon: icons.shield, tone: 'danger' },
    { label: 'Top Threat', value: topThreatLevel.level.toUpperCase(), icon: icons.mail, tone: 'warn' },
    { label: 'Avg Safety', value: `${averageSafety}%`, icon: icons.chart, tone: 'success' },
  ];

  return (
    <div className="fade-up">
      <div className="page-header">
        <h1 className="page-title">Welcome back</h1>
        <p className="page-subtitle">Interactive telemetry and AI risk intelligence for your latest scans</p>
      </div>

      <div className="analytics-toolbar card card-pad-md">
        <div className="analytics-controls-left">
          <div className="window-toggle">
            {(['24h', '7d', 'all'] as const).map((windowName) => (
              <button
                key={windowName}
                className={`chip-btn ${timeWindow === windowName ? 'active' : ''}`}
                onClick={() => setTimeWindow(windowName)}
              >
                {windowName.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="risk-slider-wrap">
            <label htmlFor="risk-threshold" className="risk-label">Risk Threshold: {riskThreshold}%</label>
            <input
              id="risk-threshold"
              type="range"
              min={10}
              max={90}
              step={5}
              value={riskThreshold}
              onChange={(event) => setRiskThreshold(Number(event.target.value))}
            />
          </div>
        </div>

        <div className="analytics-controls-right">
          <label className="live-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(event) => setAutoRefresh(event.target.checked)}
            />
            Live Auto-Refresh
          </label>
          <select
            className="refresh-select"
            value={refreshEverySec}
            onChange={(event) => setRefreshEverySec(Number(event.target.value))}
            disabled={!autoRefresh}
            title="Auto-refresh interval"
          >
            <option value={10}>10s</option>
            <option value={20}>20s</option>
            <option value={30}>30s</option>
          </select>

          <button className="btn btn-ghost" onClick={() => void refreshFromApi()} disabled={loadingLiveData}>
            {loadingLiveData ? 'Refreshing...' : 'Refresh Now'}
          </button>
          <button className="btn btn-ghost" onClick={handleExportCsv}>Export CSV</button>
          <button className="btn btn-primary" onClick={handleExportSummary}>Export Summary</button>
        </div>
      </div>

      <div className="live-status-row">
        <span className={`live-pill ${autoRefresh ? 'on' : 'off'}`}>{autoRefresh ? 'LIVE' : 'PAUSED'}</span>
        <span className="last-updated-text">
          Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'waiting for first refresh'}
        </span>
      </div>
      {refreshError && <p className="history-meta">{refreshError}</p>}

      <div className="overview-stats">
        {/* KPI cards are intentionally data-driven so new metrics can be added without changing JSX layout. */}
        {kpiCards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="stat-card-header">
              <div className={`stat-icon stat-icon-${card.tone}`}>
                <Icon d={card.icon} size={18} stroke="currentColor" />
              </div>
            </div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="level-filter-row card card-pad-md">
        {LEVEL_ORDER.map((level) => (
          <button
            key={level}
            className={`chip-btn level-chip level-chip-${level} ${activeLevels[level] ? 'active' : ''}`}
            onClick={() => setActiveLevels((prev) => ({ ...prev, [level]: !prev[level] }))}
          >
            {level.toUpperCase()} ({levelCounts[level]})
          </button>
        ))}
        {focusedLevel && (
          <button className="chip-btn" onClick={() => setFocusedLevel(null)}>
            Clear Focus: {focusedLevel.toUpperCase()}
          </button>
        )}
      </div>

      <div className="analytics-grid">
        <div className="card card-pad-lg chart-card">
          <div className="chart-header">
            <h3 className="section-title">Safety Trend (Line Chart)</h3>
            <button className="btn btn-ghost" onClick={() => trendChartRef.current?.resetZoom()}>Reset Zoom</button>
          </div>
          <div className="chart-stage">
            <Line ref={trendChartRef} data={trendChartData} options={trendOptions} />
          </div>
        </div>

        <div className="card card-pad-lg chart-card">
          <h3 className="section-title">Threat Breakdown (Bar Chart)</h3>
          <div className="chart-stage">
            <Bar data={threatBreakdownData} options={barOptions} />
          </div>
        </div>

        <div className="card card-pad-lg chart-card">
          <h3 className="section-title">Threat Distribution (Doughnut Chart)</h3>
          <div className="chart-stage">
            <Doughnut data={distributionData} options={doughnutOptions} />
          </div>
        </div>

        <div className="card card-pad-lg insight-card">
          <h3 className="section-title">AI Outcome Insights</h3>
          <p className="insight-copy">
            Dominant threat is <strong>{topThreatLevel.level.toUpperCase()}</strong> with {topThreatLevel.count} high-risk scans in the selected window.
          </p>
          <p className="insight-copy">
            Average safety score is <strong>{averageSafety}%</strong>. Recommendation: {averageSafety < 65 ? 'tighten detection policies and review flagged payloads immediately.' : 'continue monitoring with current controls.'}
          </p>
          <p className="insight-copy">
            Applied threshold is <strong>{riskThreshold}% risk</strong>, so scans above this risk band are highlighted for triage/export.
          </p>
        </div>
      </div>

      <div className="card card-pad-lg">
        <div className="section-title">Recent Activity</div>
        <div className="stack-sm">
          {/* Activity rows reuse severity badges so visual language stays consistent across dashboard modules. */}
          {recentRecords.map((record) => (
            <div key={record.id} className="history-row">
              <div className={`level-badge level-${record.level}`}>
                <span className="level-emoji">{record.level === 'clean' ? 'OK' : record.level === 'spam' ? 'SP' : record.level === 'malware' ? 'MW' : 'PH'}</span>
              </div>
              <div className="history-main">
                <div className="history-preview">{record.preview}</div>
                <div className="history-meta">{record.timestamp.toLocaleTimeString()} · Score: {record.safetyScore}%</div>
              </div>
              <span className={`badge badge-${record.level}`}>{record.level}</span>
            </div>
          ))}
          {recentRecords.length === 0 && (
            <p className="history-meta">No scans match current filters. Lower threshold or clear focus to broaden results.</p>
          )}
        </div>
      </div>
    </div>
  );
}
