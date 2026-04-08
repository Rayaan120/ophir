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
    { 
      name: t('nav.properties'), 
      isDropdown: true, 
      subLinks: [
        { name: t('nav.buy'), path: '/buy' },
        { name: t('nav.rent'), path: '/rent' },
        { name: t('nav.offPlan'), path: '/new-projects' },
      ]
    },
    { name: t('nav.insights'), isDropdown: false, path: '/global-insights' },
    { name: t('nav.contact'), isDropdown: false, path: '/contact' },
    { name: t('nav.hotOffers'), isDropdown: false, highlight: true, path: '/hot-offers' },
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

        {/* Center/Right: Actions & Toggle */}
        <div className="navbar-controls">
          <div className="navbar-actions">
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
              className="theme-toggle-btn nav-action-icon with-label"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={18} />
                  <span className="theme-toggle-text">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={18} />
                  <span className="theme-toggle-text">Dark Mode</span>
                </>
              )}
            </button>
          </div>

          {/* Universal Toggle */}
          <div className="mobile-toggle" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={28} className="mobile-menu-icon" />
          </div>
        </div>
      </div>

      {/* Slide-Out Panel */}
      <div className={`mobile-panel ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-panel-header">
          <div className="navbar-logo">
            <Link to={`/${currentLang}`} onClick={() => setMobileMenuOpen(false)}>
              <img src="/logo.png" alt="Ophir Properties" className="logo-image" style={{ height: '40px' }} />
            </Link>
          </div>
          <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>
            <X size={24} className="close-icon" />
          </button>
        </div>

        <div className="mobile-menu-links">
          {navLinks.map((link, idx) => {
            if (link.isDropdown) {
              return (
                <div key={idx} className="mobile-nav-group">
                  <div className="mobile-nav-link dropdown-trigger disabled">
                    {link.name}
                    <ChevronDown size={16} />
                  </div>
                  <div className="mobile-dropdown-items">
                    {link.subLinks.map((sub, sIdx) => (
                      <Link
                        key={sIdx}
                        to={getPath(sub.path)}
                        className={`mobile-nav-link sub-link ${isActive(sub.path) ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }
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
