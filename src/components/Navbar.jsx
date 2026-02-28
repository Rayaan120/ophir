import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' ? window.scrollY > 50 : false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

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
    { name: 'Home', isDropdown: false, path: '/' },
    { name: 'Buy', isDropdown: false, path: '/buy' },
    { name: 'Rent', isDropdown: false, path: '/rent' },
    { name: 'Off-Plan', isDropdown: false, path: '/new-projects' },
    { name: 'Hot Offers', isDropdown: false, highlight: true },
    { name: 'Insights', isDropdown: true },
    { name: 'About', isDropdown: false, path: '/about' },
    { name: 'Contact', isDropdown: false, path: '/contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">

        {/* Left: Logo */}
        <div className="navbar-logo">
          <Link to="/">
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
                  to={link.path || undefined}
                  href={!link.path ? '#' : undefined}
                  className={`nav-link ${link.highlight ? 'gold-text' : ''}`}
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
          <button
            className="theme-toggle-btn nav-action-icon"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <div className="nav-separator"></div>

          <div className="nav-action-icon">
            <Heart size={20} />
            <span className="badge">2</span>
          </div>
          <div className="nav-separator"></div>
          <div className="nav-action-icon">
            <Search size={20} />
          </div>
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
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
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
        <div className="mobile-menu-links">
          {navLinks.map((link, idx) => {
            const LinkEl = link.path ? Link : 'a';
            return (
              <LinkEl
                key={idx}
                to={link.path || undefined}
                href={!link.path ? '#' : undefined}
                className={`mobile-nav-link ${link.highlight ? 'gold-text' : ''}`}
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
