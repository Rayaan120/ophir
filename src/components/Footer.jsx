import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
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
                            Premier luxury real estate investment and brokerage in the UAE. Curating wealth-generating assets for the discerning few.
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
                        <h4 className="footer-heading">Quick Links</h4>
                        <ul className="footer-links">
                            <li><a href="#">Home</a></li>
                            <li><a href="#">Buy</a></li>
                            <li><a href="#">Rent</a></li>
                            <li><a href="#">Off-Plan</a></li>
                            <li><a href="#" className="gold-text">Hot Offers</a></li>
                            <li><a href="#">Insights</a></li>
                            <li><a href="#">About</a></li>
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
                        <h4 className="footer-heading">Contact Us</h4>
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
                    <p className="copyright">&copy; {new Date().getFullYear()} Ophir Properties LLC. All rights reserved.</p>
                    <div className="legal-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
