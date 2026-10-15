import type { ReactElement } from 'react';
import { threatIntel } from './data';

// Threat intel subpage visualizes active external campaigns and severity trends.
export default function ThreatsPage(): ReactElement {
  return (
    <div className="fade-up">
      <div className="page-header">
        <h1 className="page-title">Threat Intelligence</h1>
        <p className="page-subtitle">Live feed of monitored threat campaigns</p>
      </div>

      <div className="threat-live-banner">
        <strong>LIVE:</strong>
        <span>Critical campaigns are currently active in global telemetry.</span>
      </div>

      <div className="card card-pad-md stack-sm">
        {threatIntel.map((t) => (
          <div key={`${t.type}-${t.source}`} className="threat-row">
            <div className={`threat-dot threat-dot-${t.severity}`} />
            <div className="threat-main">
              <div className="threat-type">{t.type}</div>
              <div className="threat-source">{t.source}</div>
            </div>
            <span className={`badge badge-severity-${t.severity}`}>{t.severity}</span>
            <div className="threat-time">{t.detected}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
