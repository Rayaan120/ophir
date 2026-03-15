import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../ThemeContext';
import CurrencySelector from './CurrencySelector';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' ? window.scrollY > 50 : false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const location = useLocation();
  const navigate = useNavigate();

  const switchLanguage = (newLang) => {
    if (newLang === currentLang) return;
    const newPath = location.pathname.replace(`/${currentLang}`, `/${newLang}`);
    navigate(newPath + location.search + location.hash);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Check initially to ensure state is in sync
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.about'), isDropdown: false, path: '/about' },
    { name: t('nav.services'), isDropdown: false, path: '/services' },
    { name: t('nav.buy'), isDropdown: false, path: '/buy' },
    { name: t('nav.rent'), isDropdown: false, path: '/rent' },
    { name: t('nav.offPlan'), isDropdown: false, path: '/new-projects' },
    { name: t('nav.insights'), isDropdown: false, path: '/global-insights' },
    { name: t('nav.contact'), isDropdown: false, path: '/contact' },
    { name: t('nav.hotOffers'), isDropdown: false, highlight: true },
  ];

  const getPath = (path) => {
    if (!path) return undefined;
    return `/${currentLang}${path === '/' ? '' : path}`;
  };

  const isActive = (path) => {
    if (!path) return false;
    const fullPath = getPath(path);
    if (path === '/') return location.pathname === fullPath || location.pathname === `/${currentLang}`;
    return location.pathname === fullPath || location.pathname.startsWith(`${fullPath}/`);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">

        {/* Left: Logo */}
        <div className="navbar-logo">
          <Link to={`/${currentLang}`}>
            <img src="/logo.png" alt="Ophir Properties" className="logo-image" />
          </Link>
        </div>

        {/* Center: Desktop Menu */}
        <div className="navbar-menu desktop-only">
          {navLinks.map((link, idx) => {
            const LinkEl = link.path ? Link : 'a';
            return (
              <div key={idx} className="nav-item">
                <LinkEl
                  to={getPath(link.path)}
                  href={!link.path ? '#' : undefined}
                  className={`nav-link ${link.highlight ? 'red-text' : ''} ${isActive(link.path) ? 'active' : ''}`}
                >
                  {link.name}
                  {link.isDropdown && <ChevronDown size={14} className="dropdown-icon" />}
                </LinkEl>
              </div>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="navbar-actions desktop-only">
          <div className="lang-switcher">
            <button
              className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
              onClick={() => switchLanguage('en')}
            >
              EN
            </button>
            <span className="lang-separator">|</span>
            <button
              className={`lang-btn ${currentLang === 'ar' ? 'active' : ''}`}
              onClick={() => switchLanguage('ar')}
            >
              AR
            </button>
          </div>
          <CurrencySelector />
          <button
            className="theme-toggle-btn nav-action-icon"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="mobile-toggle mobile-only" onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} className="mobile-menu-icon" />
        </div>
      </div>

      {/* Mobile Slide-Out Panel */}
      <div className={`mobile-panel ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-panel-header">
          <div className="navbar-logo">
            <Link to={`/${currentLang}`} onClick={() => setMobileMenuOpen(false)}>
              <img src="/logo.png" alt="Ophir Properties" className="logo-image" style={{ height: '40px' }} />
            </Link>
          </div>
          <div className="mobile-header-actions">
            <button
              className="theme-toggle-btn nav-action-icon mobile-theme-btn"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Moon size={22} /> : <Sun size={22} />}
            </button>
            <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>
              <X size={24} className="close-icon" />
            </button>
          </div>
        </div>
        <div className="mobile-lang-switcher" style={{ display: 'flex', gap: '8px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
          <button
            className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
            onClick={() => { switchLanguage('en'); setMobileMenuOpen(false); }}
          >
            EN
          </button>
          <span className="lang-separator">|</span>
          <button
            className={`lang-btn ${currentLang === 'ar' ? 'active' : ''}`}
            onClick={() => { switchLanguage('ar'); setMobileMenuOpen(false); }}
          >
            AR
          </button>
        </div>
        <div style={{ padding: '0 20px', marginBottom: '16px' }}>
          <CurrencySelector />
        </div>
        <div className="mobile-menu-links">
          {navLinks.map((link, idx) => {
            const LinkEl = link.path ? Link : 'a';
            return (
              <LinkEl
                key={idx}
                to={getPath(link.path)}
                href={!link.path ? '#' : undefined}
                className={`mobile-nav-link ${link.highlight ? 'red-text' : ''} ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
                {link.isDropdown && <ChevronDown size={16} />}
              </LinkEl>
            );
          })}
        </div>
      </div>
      {mobileMenuOpen && <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}></div>}
    </nav>
  );
};

export default Navbar;
