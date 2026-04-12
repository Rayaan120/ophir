import { Facebook, Music2, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';
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
                            <Link to={`/${i18n.language || 'en'}`}>
                                <img src="/logo.png" alt="Ophir Properties" className="logo-image-footer" />
                            </Link>
                        </div>
                        <p className="footer-desc">
                            {t('footer.about')}
                        </p>
                        <div className="social-links">
                            <a href="https://www.facebook.com/ophirproperties/" target="_blank" rel="noopener noreferrer" className="social-icon"><Facebook size={18} /></a>
                            <a href="https://www.tiktok.com/@ophirpropertiesofficial" target="_blank" rel="noopener noreferrer" className="social-icon"><Music2 size={18} /></a>
                            <a href="https://www.instagram.com/ophirpropertiesofficial/" target="_blank" rel="noopener noreferrer" className="social-icon"><Instagram size={18} /></a>
                            <a href="https://www.linkedin.com/company/ophirproperties" target="_blank" rel="noopener noreferrer" className="social-icon"><Linkedin size={18} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-col">
                        <h4 className="footer-heading">{t('footer.quickLinks')}</h4>
                        <ul className="footer-links">
                            <li><Link to={`/${i18n.language}`}>{t('nav.home')}</Link></li>
                            <li><Link to={`/${i18n.language}/buy`}>{t('nav.buy')}</Link></li>
                            <li><Link to={`/${i18n.language}/rent`}>{t('nav.rent')}</Link></li>
                            <li><Link to={`/${i18n.language}/new-projects`}>{t('nav.offPlan')}</Link></li>
                            <li><Link to={`/${i18n.language}/buy`} className="red-text">{t('nav.hotOffers')}</Link></li>
                            <li><Link to={`/${i18n.language}/global-insights`}>{t('nav.insights')}</Link></li>
                            <li><Link to={`/${i18n.language}/about`}>{t('nav.about')}</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="footer-col">
                        <h4 className="footer-heading">{t('servicesPage.heroLabel')}</h4>
                        <ul className="footer-links">
                            <li><Link to={`/${i18n.language}/services#investment-advisory`}>{t('servicesPage.svc1Title')}</Link></li>
                            <li><Link to={`/${i18n.language}/services#off-plan-access`}>{t('servicesPage.svc2Title')}</Link></li>
                            <li><Link to={`/${i18n.language}/services#buying-assistance`}>{t('servicesPage.svc3Title')}</Link></li>
                            <li><Link to={`/${i18n.language}/services#selling-resale`}>{t('servicesPage.svc4Title')}</Link></li>
                            <li><Link to={`/${i18n.language}/services#property-management`}>{t('servicesPage.svc5Title')}</Link></li>
                            <li><Link to={`/${i18n.language}/services#golden-visa`}>{t('servicesPage.svc6Title')}</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer-col contact-col">
                        <h4 className="footer-heading">{t('footer.contact')}</h4>
                        <div className="contact-info">
                            <div className="contact-item">
                                <span>{t('common.address')}</span>
                            </div>
                            <div className="contact-item">
                                <a href="tel:+97145576289"><span>+971 4 557 6289</span></a>
                            </div>
                            <div className="contact-item">
                                <a href={`mailto:${t('common.email')}`}><span>{t('common.email')}</span></a>
                            </div>
                        </div>

                        <div className="footer-map-container">
                            <iframe
                                title="Ophir Properties Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3612.3789431872124!2d55.186121!3d25.096924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6b004775acfb%3A0x3bd6d936175cd0af!2sThe%20Onyx%20Tower%201!5e0!3m2!1sen!2sae!4v1711475000000!5m2!1sen!2sae"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
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
