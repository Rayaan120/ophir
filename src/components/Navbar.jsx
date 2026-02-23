import { useState, useEffect } from 'react';
import { Heart, Search, Menu, X, ChevronDown } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', isDropdown: false },
    { name: 'Buy', isDropdown: true },
    { name: 'Rent', isDropdown: true },
    { name: 'Off-Plan', isDropdown: true },
    { name: 'Hot Offers', isDropdown: false, highlight: true },
    { name: 'Insights', isDropdown: true },
    { name: 'About', isDropdown: false },
    { name: 'Contact', isDropdown: false },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">

        {/* Left: Logo */}
        <div className="navbar-logo">
          <img src="/logo.png" alt="Ophir Properties" className="logo-image" />
        </div>

        {/* Center: Desktop Menu */}
        <div className="navbar-menu desktop-only">
          {navLinks.map((link, idx) => (
            <div key={idx} className="nav-item">
              <a href="#" className={`nav-link ${link.highlight ? 'gold-text' : ''}`}>
                {link.name}
                {link.isDropdown && <ChevronDown size={14} className="dropdown-icon" />}
              </a>
            </div>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="navbar-actions desktop-only">
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
          <Menu size={24} color="#f5f5f5" />
        </div>
      </div>

      {/* Mobile Slide-Out Panel */}
      <div className={`mobile-panel ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-panel-header">
          <span className="logo-text">OPHIR</span>
          <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>
            <X size={24} color="#f5f5f5" />
          </button>
        </div>
        <div className="mobile-menu-links">
          {navLinks.map((link, idx) => (
            <a key={idx} href="#" className={`mobile-nav-link ${link.highlight ? 'gold-text' : ''}`}>
              {link.name}
              {link.isDropdown && <ChevronDown size={16} />}
            </a>
          ))}
        </div>
      </div>
      {mobileMenuOpen && <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}></div>}
    </nav>
  );
};

export default Navbar;
