import type { ReactElement } from 'react';

// Reports page surfaces exportable summaries for weekly/monthly security tracking.
export default function ReportsPage(): ReactElement {
  const reports = [
    { title: 'Weekly Summary', date: 'Mar 30 - Apr 5, 2026', scans: 127, threats: 34, status: 'ready' },
    { title: 'Monthly Overview', date: 'March 2026', scans: 512, threats: 143, status: 'ready' },
    { title: 'Threat Analysis', date: 'Q1 2026', scans: 1840, threats: 420, status: 'generating' },
    { title: 'Compliance Report', date: '2025', scans: 6201, threats: 1230, status: 'ready' },
  ] as const;

  return (
    <div className="fade-up">
      <div className="reports-header-row">
        <div className="page-header page-header-tight">
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Download and share security reports</p>
        </div>
        <button className="btn btn-primary">Generate New Report</button>
      </div>

      <div className="reports-grid">
        {reports.map((r) => (
          <div key={r.title} className="card card-pad-lg">
            <div className="report-title-row">
              <strong>{r.title}</strong>
              <span className={`badge ${r.status === 'ready' ? 'badge-ready' : 'badge-generating'}`}>{r.status}</span>
            </div>
            <div className="report-date">{r.date}</div>
            <div className="report-metrics">
              <div>
                <div className="report-metric-value">{r.scans}</div>
                <div className="report-metric-label">Scans</div>
              </div>
              <div>
                <div className="report-metric-value report-metric-danger">{r.threats}</div>
                <div className="report-metric-label">Threats</div>
              </div>
            </div>
            <button className="btn btn-ghost report-download" disabled={r.status !== 'ready'}>
              Download PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
