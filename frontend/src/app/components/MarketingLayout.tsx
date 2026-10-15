import { Link, Outlet } from 'react-router-dom';
import { useTheme } from 'next-themes';
import '../pages/landing.css';

const navGroups = [
  {
    label: 'Product',
    links: [
      { to: '/features', label: 'Features' },
      { to: '/pricing', label: 'Pricing' },
      { to: '/security', label: 'Security' },
    ],
  },
  {
    label: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/blog', label: 'Blog' },
      { to: '/careers', label: 'Careers' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { to: '/docs', label: 'Docs' },
      { to: '/tutorials', label: 'Tutorials' },
      { to: '/api-reference', label: 'API Reference' },
    ],
  },
] as const;

export default function MarketingLayout() {
  const { theme, setTheme } = useTheme();
  const isDark = theme !== 'light';

  const ShieldIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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

  return (
    <div className={`landing-shell ${isDark ? 'landing-dark' : 'landing-light'}`}>
      <nav className="landing-nav">
        <div className="landing-header-shell">
          <div className="landing-header-top">
            <Link to="/" className="landing-brand-link">
              <div className="landing-brand-icon-wrap">
                <ShieldIcon size={30} />
              </div>
              <span className="landing-brand-text">SecureGuard</span>
            </Link>

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

      <main>
        <Outlet />
      </main>

      <footer id="resources" className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer-grid">
          <div>
            <div className="landing-footer-brand">
              <ShieldIcon size={22} />
              <span>SecureGuard</span>
            </div>
            <p className="landing-footer-copy">
              Advanced spam and malware detection to keep your digital life secure.
            </p>
          </div>
          {navGroups.map((group) => (
            <div key={group.label}>
              <h4 className="mb-4 text-slate-950 dark:text-white">{group.label}</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link className="hover:text-slate-950 dark:hover:text-white" to={link.to}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
          <div className="landing-footer-bottom">
          2026 SecureGuard. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}