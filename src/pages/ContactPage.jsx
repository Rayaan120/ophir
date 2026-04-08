import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MessageSquare, MapPin, CheckCircle2, ChevronDown, ChevronUp, Send, HelpCircle, ArrowRight } from 'lucide-react';
import './ContactPage.css';

const ContactPage = () => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        interest: 'Buying a property',
        budget: 'AED 1M – 3M',
        areas: '',
        message: ''
    });

    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeFaq, setActiveFaq] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, source: 'Website Contact Page' })
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', message: t('contactPage.successMsg') });
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    interest: 'Buying a property',
                    budget: 'AED 1M – 3M',
                    areas: '',
                    message: ''
                });
            } else {
                setStatus({ type: 'error', message: data.error || t('contactPage.errorMsg') });
            }
        } catch (err) {
            setStatus({ type: 'error', message: t('contactPage.connError') });
        } finally {
            setIsSubmitting(false);
        }
    };

    const faqs = Array.from({ length: 11 }, (_, i) => ({
        q: t(`contactPage.faq${i + 1}Q`),
        a: t(`contactPage.faq${i + 1}A`)
    }));

    return (
        <div className="contact-page animate-fade-in">
            {/* Hero Section */}
            <section className="contact-hero" style={{ backgroundImage: "url('/contact/contact-hero.png')" }}>
                <div className="contact-hero-container">
                    <div className="hero-content">
                        <span className="hero-label">{t('contactPage.heroLabel')}</span>
                        <h1 className="hero-title">{t('contactPage.heroTitle')}</h1>
                        <p className="hero-subtext">
                            {t('contactPage.heroSubtext')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Luxury Service Ribbon */}
            <section className="luxury-contact-ribbon">
                <div className="ribbon-container">
                    <div className="ribbon-inner">
                        <a href="tel:+971562125424" className="ribbon-item">
                            <div className="item-icon-wrapper">
                                <Phone className="item-icon" size={24} />
                            </div>
                            <div className="item-content">
                                <span className="item-label">{t('contactPage.ribbonMobile')}</span>
                                <h3 className="item-value">+971 56 212 5424</h3>
                            </div>
                        </a>
                        <div className="ribbon-divider" />
                        <a href="tel:+97145576289" className="ribbon-item">
                            <div className="item-icon-wrapper">
                                <Phone className="item-icon" size={24} />
                            </div>
                            <div className="item-content">
                                <span className="item-label">{t('contactPage.ribbonLandline')}</span>
                                <h3 className="item-value">+971 4 557 6289</h3>
                            </div>
                        </a>
                        <div className="ribbon-divider" />
                        <a href={`mailto:${t('contactPage.officeEmail')}`} className="ribbon-item">
                            <div className="item-icon-wrapper">
                                <Mail className="item-icon" size={24} />
                            </div>
                            <div className="item-content">
                                <span className="item-label">{t('contactPage.ribbonEmail')}</span>
                                <h3 className="item-value">{t('contactPage.officeEmail')}</h3>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* Main Enquiry Section */}
            <section className="enquiry-section">
                <div className="enquiry-container">
                    {/* Form Side */}
                    <div className="form-wrapper">
                        <div className="form-header">
                            <h2>{t('contactPage.formTitle')}</h2>
                            <p>{t('contactPage.formSubtitle')}</p>
                        </div>

                        {status.message && (
                            <div className={`form-status ${status.type}`}>
                                {status.type === 'success' ? <CheckCircle2 size={20} /> : <HelpCircle size={20} />}
                                {status.message}
                            </div>
                        )}

                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">{t('contactPage.labelName')}</label>
                                    <input
                                        type="text" name="fullName" className="form-input"
                                        placeholder={t('contactPage.placeholderName')} required
                                        value={formData.fullName} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('contactPage.labelEmail')}</label>
                                    <input
                                        type="email" name="email" className="form-input"
                                        placeholder="name@example.com" required
                                        value={formData.email} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('contactPage.labelPhone')}</label>
                                    <input
                                        type="tel" name="phone" className="form-input"
                                        placeholder="+971 XX XXX XXXX" required
                                        value={formData.phone} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('contactPage.labelInterest')}</label>
                                    <select
                                        name="interest" className="form-select" required
                                        value={formData.interest} onChange={handleInputChange}
                                    >
                                        <option value="Buying a property">{t('contactPage.optBuy')}</option>
                                        <option value="Renting a property">{t('contactPage.optRent')}</option>
                                        <option value="New projects / off-plan">{t('contactPage.optNew')}</option>
                                        <option value="Selling my property">{t('contactPage.optSell')}</option>
                                        <option value="General enquiry">{t('contactPage.optGeneral')}</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('contactPage.labelBudget')}</label>
                                    <select
                                        name="budget" className="form-select"
                                        value={formData.budget} onChange={handleInputChange}
                                    >
                                        <option value="Up to AED 1M">{t('contactPage.optBudget1')}</option>
                                        <option value="AED 1M – 3M">{t('contactPage.optBudget2')}</option>
                                        <option value="AED 3M – 5M">{t('contactPage.optBudget3')}</option>
                                        <option value="AED 5M+">{t('contactPage.optBudget4')}</option>
                                        <option value="Not decided yet">{t('contactPage.optBudget5')}</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('contactPage.labelAreas')}</label>
                                    <input
                                        type="text" name="areas" className="form-input"
                                        placeholder={t('contactPage.placeholderAreas')}
                                        value={formData.areas} onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">{t('contactPage.labelMsg')}</label>
                                <textarea
                                    name="message" className="form-textarea"
                                    placeholder={t('contactPage.placeholderMsg')}
                                    required
                                    value={formData.message} onChange={handleInputChange}
                                ></textarea>
                            </div>

                            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                {isSubmitting ? t('contactPage.submittingBtn') : t('contactPage.submitBtn')}
                            </button>
                        </form>
                    </div>

                    {/* Reassurance Side */}
                    <div className="reassurance-panel">
                        <div className="reassurance-content">
                            <h3>{t('contactPage.whyTitle')}</h3>
                            <div className="benefits-list">
                                <div className="benefit-item">
                                    <CheckCircle2 className="benefit-check" size={24} />
                                    <div className="benefit-info">
                                        <h4>{t('contactPage.b1Title')}</h4>
                                        <p>{t('contactPage.b1Desc')}</p>
                                    </div>
                                </div>
                                <div className="benefit-item">
                                    <CheckCircle2 className="benefit-check" size={24} />
                                    <div className="benefit-info">
                                        <h4>{t('contactPage.b2Title')}</h4>
                                        <p>{t('contactPage.b2Desc')}</p>
                                    </div>
                                </div>
                                <div className="benefit-item">
                                    <CheckCircle2 className="benefit-check" size={24} />
                                    <div className="benefit-info">
                                        <h4>{t('contactPage.b3Title')}</h4>
                                        <p>{t('contactPage.b3Desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="panel-footer">
                            <div className="stat-item">
                                <span className="stat-val">15+</span>
                                <span className="stat-lbl">{t('contactPage.statYears')}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-val">Dubai</span>
                                <span className="stat-lbl">{t('contactPage.statHQ')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Office Location */}
            <section className="office-section">
                <div className="office-container">
                    <div className="location-info">
                        <h2>{t('contactPage.officeTitle')}</h2>
                        <div className="address-block">
                            <span className="office-name">{t('contactPage.officeName')}</span>
                            <p className="address-text">
                                {t('contactPage.officeAddress')}
                            </p>
                            <p className="address-text" style={{ marginTop: '8px' }}>
                                <Mail size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                                <a href={`mailto:${t('contactPage.officeEmail')}`} className="gold-text">
                                    {t('contactPage.officeEmail')}
                                </a>
                            </p>
                        </div>

                        <div className="hours-block">
                            <span className="hours-title">{t('contactPage.hoursTitle')}</span>
                            <div className="hours-row">
                                <span>{t('contactPage.hoursMF')}</span>
                                <span>{t('contactPage.hoursMFVal')}</span>
                            </div>
                            <div className="hours-row">
                                <span>{t('contactPage.hoursSat')}</span>
                                <span>{t('contactPage.hoursSatVal')}</span>
                            </div>
                            <div className="hours-row">
                                <span>{t('contactPage.hoursSun')}</span>
                                <span className="gold-text">{t('contactPage.hoursSunVal')}</span>
                            </div>
                        </div>

                        <a href="https://maps.app.goo.gl/xcXbRaYaU5GiduYdA" target="_blank" rel="noopener noreferrer" className="view-details-btn" style={{ width: 'fit-content' }}>
                            {t('contactPage.directions')}
                            <ArrowRight size={18} />
                        </a>
                    </div>
                    <a
                        href="https://maps.app.goo.gl/xcXbRaYaU5GiduYdA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="map-link-wrapper"
                    >
                        <div className="map-frame-wrapper">
                            <iframe
                                title="Ophir Properties Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57810.32431014283!2d55.096570621679675!3d25.096943400000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6b004775acfb%3A0x3bd6d936175cd0af!2sOphir%20Properties!5e0!3m2!1sen!2sae!4v1772290436429!5m2!1sen!2sae"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                            <div className="map-click-overlay"></div>
                        </div>
                    </a>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <h2>{t('contactPage.faqTitle')}</h2>
                <div className="faq-accordion">
                    {faqs.map((faq, index) => (
                        <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
                            <div className="faq-header" onClick={() => setActiveFaq(activeFaq === index ? null : index)}>
                                <span>{faq.q}</span>
                                {activeFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                            {activeFaq === index && (
                                <div className="faq-answer animate-fade-in">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
