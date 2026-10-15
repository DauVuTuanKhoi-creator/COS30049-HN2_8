import { useState } from 'react';
import type { ReactElement } from 'react';

// Settings is split by concern tabs so each configuration area remains focused.
export default function SettingsPage(): ReactElement {
  const [settingsTab, setSettingsTab] = useState<'profile' | 'notifications' | 'security' | 'api'>('profile');

  return (
    <div className="fade-up">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>

      <div className="settings-grid">
        <div className="card settings-nav-card">
          {[
            { id: 'profile', label: 'Profile' },
            { id: 'notifications', label: 'Notifications' },
            { id: 'security', label: 'Security' },
            { id: 'api', label: 'API Access' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${settingsTab === tab.id ? 'active' : ''}`}
              onClick={() => setSettingsTab(tab.id as 'profile' | 'notifications' | 'security' | 'api')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="card settings-panel-card">
          {settingsTab === 'profile' && (
            <>
              <h3 className="settings-heading">Profile Settings</h3>
              <label className="field-label">Display Name</label>
              <input type="text" defaultValue="test2" className="settings-input" placeholder="Display name" title="Display Name" />
              <label className="field-label">Email</label>
              <input type="email" defaultValue="test2@gmail.com" className="settings-input" placeholder="Email address" title="Email" />
              <button className="btn btn-primary">Save Changes</button>
            </>
          )}

          {settingsTab === 'notifications' && (
            <>
              <h3 className="settings-heading">Notification Preferences</h3>
              <p className="settings-copy">Configure alert channels and report cadence.</p>
            </>
          )}

          {settingsTab === 'security' && (
            <>
              <h3 className="settings-heading">Security</h3>
              <p className="settings-copy">Configure session policy and account protection controls.</p>
            </>
          )}

          {settingsTab === 'api' && (
            <>
              <h3 className="settings-heading">API Access</h3>
              <p className="settings-copy">Use this key for external integrations.</p>
              <div className="api-key">sg_live_••••••••••••••••••••••</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
