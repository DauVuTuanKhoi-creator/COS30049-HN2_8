import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme } from 'next-themes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Switch } from '../components/ui/switch';
import { getCurrentUser, signOut } from '../utils/auth';
import OverviewPage from './dashboard/OverviewPage';
import ScannerPage from './dashboard/ScannerPage';
import HistoryPage from './dashboard/HistoryPage';
import ThreatsPage from './dashboard/ThreatsPage';
import ReportsPage from './dashboard/ReportsPage';
import SettingsPage from './dashboard/SettingsPage';
import { Icon, icons } from './dashboard/icons';
import type { Page } from './dashboard/types';
import './dashboard/dashboard.css';

export default function Dashboard() {
  // Router navigation is used for auth guard redirects and cross-page transitions.
  const navigate = useNavigate();
  // next-themes provides the persisted theme mode used by the dashboard token classes.
  const { theme, setTheme } = useTheme();
  const user = getCurrentUser();

  // Dashboard-level navigation state controls which subpage component is active.
  const [page, setPage] = useState<Page>('overview');
  // Notification popover is local UI state because it does not need URL persistence.
  const [notifOpen, setNotifOpen] = useState(false);
  // This powers the left "drawer" experience: collapsed keeps icons visible while reclaiming content space.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!user) {
    // Route protection: unauthenticated users are always redirected to sign-in.
    navigate('/signin');
    return null;
  }

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  // Single source of truth for dashboard navigation labels/icons and active-page matching.
  const navItems: Array<{ id: Page; label: string; icon: string }> = [
    { id: 'overview', label: 'Overview', icon: icons.overview },
    { id: 'scanner', label: 'Scanner', icon: icons.scan },
    { id: 'history', label: 'Scan History', icon: icons.history },
    { id: 'threats', label: 'Threat Intel', icon: icons.threat },
    { id: 'reports', label: 'Reports', icon: icons.reports },
    { id: 'settings', label: 'Settings', icon: icons.settings },
  ];

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p: string) => p[0]?.toUpperCase())
    .join('');

  // ThemeProvider stores either "dark" or "light" and we map that into dashboard token classes.
  const dashboardThemeClass = theme === 'light' ? 'dashboard-light' : 'dashboard-dark';

  return (
    <div className={`dashboard-shell ${dashboardThemeClass}`}>

      <aside
        className="dashboard-sidebar"
        data-collapsed={sidebarCollapsed ? 'true' : 'false'}
      >
        {/* Brand button doubles as a quick route back to public landing. */}
        <button className="dashboard-brand" onClick={() => navigate('/')}>
          <div className="dashboard-brand-icon">
            <Icon d={icons.shield} size={20} stroke="var(--accent)" />
          </div>
          {!sidebarCollapsed && <span className="dashboard-brand-text">SecureGuard</span>}
        </button>

        {/* Drawer nav buttons switch in-page panels without full route transitions. */}
        <nav className="dashboard-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? 'active' : ''}`}
              onClick={() => setPage(item.id)}
              data-collapsed={sidebarCollapsed ? 'true' : 'false'}
            >
              <Icon d={item.icon} size={18} stroke="currentColor" />
              {!sidebarCollapsed && item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={() => navigate('/')} data-collapsed={sidebarCollapsed ? 'true' : 'false'}>
            <Icon d={icons.home} size={18} stroke="currentColor" />
            {!sidebarCollapsed && <span>Back to Main</span>}
          </button>
          {/* Collapse control preserves feature access while shrinking sidebar to icon rail mode. */}
          <button className="nav-item" onClick={() => setSidebarCollapsed((v) => !v)} data-collapsed={sidebarCollapsed ? 'true' : 'false'}>
            <span className={`collapse-arrow ${sidebarCollapsed ? 'collapsed' : ''}`}>{'<'}</span>
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <span className="topbar-title">
            {navItems.find((n) => n.id === page)?.label}
          </span>

          <div className="topbar-actions">
            {/* Lightweight notification drawer anchored to the bell button. */}
            <div className="notif-wrap">
              <button className="btn btn-ghost notif-btn" onClick={() => setNotifOpen((o) => !o)} aria-label="Open notifications" title="Notifications">
                <Icon d={icons.bell} size={17} />
                <div className="notif-dot" />
              </button>
              {notifOpen && (
                <div className="notif-panel">
                  <div className="notif-panel-title">Notifications</div>
                  {['New phishing campaign detected', '3 suspicious emails blocked today', 'Weekly report is ready'].map((msg) => (
                    <div key={msg} className="notif-item">{msg}</div>
                  ))}
                </div>
              )}
            </div>

            <DropdownMenu>
              {/* Account menu centralizes settings navigation, theme toggle, and sign-out actions. */}
              <DropdownMenuTrigger asChild>
                <button className="account-trigger">
                  <Avatar className="dashboard-avatar">
                    <AvatarFallback className="dashboard-avatar-fallback">{initials || 'SG'}</AvatarFallback>
                  </Avatar>
                  <div className="account-meta">
                    <div className="account-name">{user.name}</div>
                    <div className="account-email">{user.email}</div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="account-menu">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setPage('settings')}>Account Settings</DropdownMenuItem>
                <DropdownMenuItem onSelect={(event) => event.preventDefault()} className="account-theme-item">
                  <span>Dark Theme</span>
                  <Switch checked={theme === 'dark'} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Panel host: swaps focused dashboard experiences while keeping shared chrome mounted. */}
        <main className="dashboard-content">
          {page === 'overview' && <OverviewPage />}
          {page === 'scanner' && <ScannerPage />}
          {page === 'history' && <HistoryPage />}
          {page === 'threats' && <ThreatsPage />}
          {page === 'reports' && <ReportsPage />}
          {page === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}
