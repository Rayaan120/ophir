import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const { t, i18n } = useTranslation(); // Extracted i18n
    return (
        <footer className="footer-section">
            <div className="container">
                <div className="footer-main">

                    {/* Brand Column */}
                    <div className="footer-col brand-col">
                        <div className="footer-logo">
                            <img src="/logo.png" alt="Ophir Properties" className="logo-image-footer" />
                        </div>
                        <p className="footer-desc">
                            {t('footer.about')}
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-icon"><Facebook size={18} /></a>
                            <a href="#" className="social-icon"><Twitter size={18} /></a>
                            <a href="#" className="social-icon"><Instagram size={18} /></a>
                            <a href="#" className="social-icon"><Linkedin size={18} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-col">
                        <h4 className="footer-heading">{t('footer.quickLinks')}</h4>
                        <ul className="footer-links">
                            <li><a href="#">{t('nav.home')}</a></li>
                            <li><a href="#">{t('nav.buy')}</a></li>
                            <li><a href="#">{t('nav.rent')}</a></li>
                            <li><a href="#">{t('nav.offPlan')}</a></li>
                            <li><a href="#" className="gold-text">{t('nav.hotOffers')}</a></li>
                            <li><a href="#">{t('nav.insights')}</a></li>
                            <li><a href="#">{t('nav.about')}</a></li>
                        </ul>
                    </div>

                    {/* Communities */}
                    <div className="footer-col">
                        <h4 className="footer-heading">Prime Areas</h4>
                        <ul className="footer-links">
                            <li><a href="#">Dubai Marina</a></li>
                            <li><a href="#">Downtown Dubai</a></li>
                            <li><a href="#">Palm Jumeirah</a></li>
                            <li><a href="#">Business Bay</a></li>
                            <li><a href="#">Emirates Hills</a></li>
                            <li><a href="#">Al Barari</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer-col contact-col">
                        <h4 className="footer-heading">{t('nav.contact')}</h4>
                        <div className="contact-info">
                            <div className="contact-item">
                                <MapPin size={18} className="gold-text" />
                                <span>Level 42, Boulevard Plaza Tower 1,<br />Downtown Dubai, UAE</span>
                            </div>
                            <div className="contact-item">
                                <Phone size={18} className="gold-text" />
                                <span>+971 4 000 0000</span>
                            </div>
                            <div className="contact-item">
                                <Mail size={18} className="gold-text" />
                                <span>invest@ophirproperties.com</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p className="copyright">&copy; {new Date().getFullYear()} Ophir Properties LLC. {t('footer.rights')}</p>
                    <div className="legal-links">
                        <Link to={`/${i18n.language || 'en'}/privacy-policy`}>{t('footer.privacy')}</Link>
                        <a href="#">{t('footer.terms')}</a>
                        <a href="#">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
