import React, { useState } from 'react';
import { Phone, Mail, MessageSquare, MapPin, CheckCircle2, ChevronDown, ChevronUp, Send, HelpCircle, ArrowRight } from 'lucide-react';
import './ContactPage.css';

const ContactPage = () => {
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
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', message: 'Thank you – an Ophir advisor will reach out to you shortly.' });
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
                setStatus({ type: 'error', message: data.error || 'Something went wrong. Please try again.' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Unable to connect to service. Please try again or use WhatsApp.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const faqs = [
        {
            q: "How soon will someone contact me after submitting the form?",
            a: "Our typical response time is under 12 hours. For urgent enquiries during office hours, we often respond within 60 minutes."
        },
        {
            q: "Do you charge a fee for initial property consultations?",
            a: "No, all initial consultations and portfolio strategy sessions are complimentary for our clients."
        },
        {
            q: "Can you help with mortgage or financing guidance?",
            a: "Absolutely. We work with leading mortgage advisors in the UAE to help our clients secure the best rates and terms."
        },
        {
            q: "Do you handle both sales and rentals?",
            a: "Yes, Ophir Properties is a full-service advisory. we manage luxury sales, rentals, and major off-plan project portfolios across Dubai."
        }
    ];

    return (
        <div className="contact-page animate-fade-in">
            {/* Hero Section */}
            <section className="contact-hero">
                <div className="contact-hero-container">
                    <div className="hero-content">
                        <span className="hero-label">Contact Ophir</span>
                        <h1 className="hero-title">Let's Discuss Your Next Property Move</h1>
                        <p className="hero-subtext">
                            Whether you're buying, renting, or exploring new projects, our expert advisors are here to guide you with transparent, data-driven advice.
                        </p>
                    </div>
                    <div className="hero-highlights">
                        <div className="highlight-card">
                            <MessageSquare className="highlight-icon" size={32} />
                            <p className="highlight-text">Average response time:<br /><strong>Under 24 hours</strong></p>
                        </div>
                        <div className="highlight-card">
                            <CheckCircle2 className="highlight-icon" size={32} />
                            <p className="highlight-text">Dedicated advisor for<br /><strong>every single client</strong></p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Strip */}
            <section className="contact-strip-section">
                <div className="strip-container">
                    <a href="tel:+971000000000" className="strip-card">
                        <Phone className="strip-icon" size={32} />
                        <h3 className="strip-title">Call Us</h3>
                        <p className="strip-text">Speak directly with an expert Ophir advisor today.</p>
                        <span className="strip-link">+971 X XXX XXXX</span>
                    </a>
                    <a href="https://wa.me/971000000000" target="_blank" rel="noopener noreferrer" className="strip-card">
                        <MessageSquare className="strip-icon" size={32} />
                        <h3 className="strip-title">WhatsApp</h3>
                        <p className="strip-text">Ideal for quick questions and appointment scheduling.</p>
                        <span className="strip-link">Chat with us</span>
                    </a>
                    <a href="mailto:info@ophir.ae" className="strip-card">
                        <Mail className="strip-icon" size={32} />
                        <h3 className="strip-title">Email Us</h3>
                        <p className="strip-text">Share your requirements and we'll respond with tailored options.</p>
                        <span className="strip-link">info@ophir.ae</span>
                    </a>
                    <div className="strip-card">
                        <MapPin className="strip-icon" size={32} />
                        <h3 className="strip-title">Visit Us</h3>
                        <p className="strip-text">Dubai-based advisory team with regional market expertise.</p>
                        <span className="strip-link">Business Bay, Dubai</span>
                    </div>
                </div>
            </section>

            {/* Main Enquiry Section */}
            <section className="enquiry-section">
                <div className="enquiry-container">
                    {/* Form Side */}
                    <div className="form-wrapper">
                        <div className="form-header">
                            <h2>Tell Us What You're Looking For</h2>
                            <p>Share your requirements and an advisor will get in touch with curated options.</p>
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
                                    <label className="form-label">Full Name *</label>
                                    <input
                                        type="text" name="fullName" className="form-input"
                                        placeholder="Your full name" required
                                        value={formData.fullName} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email Address *</label>
                                    <input
                                        type="email" name="email" className="form-input"
                                        placeholder="name@example.com" required
                                        value={formData.email} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone / WhatsApp *</label>
                                    <input
                                        type="tel" name="phone" className="form-input"
                                        placeholder="+971 XX XXX XXXX" required
                                        value={formData.phone} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">I'm Interested In *</label>
                                    <select
                                        name="interest" className="form-select" required
                                        value={formData.interest} onChange={handleInputChange}
                                    >
                                        <option>Buying a property</option>
                                        <option>Renting a property</option>
                                        <option>New projects / off-plan</option>
                                        <option>Selling my property</option>
                                        <option>General enquiry</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Budget Range</label>
                                    <select
                                        name="budget" className="form-select"
                                        value={formData.budget} onChange={handleInputChange}
                                    >
                                        <option>Up to AED 1M</option>
                                        <option>AED 1M – 3M</option>
                                        <option>AED 3M – 5M</option>
                                        <option>AED 5M+</option>
                                        <option>Not decided yet</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Preferred Areas</label>
                                    <input
                                        type="text" name="areas" className="form-input"
                                        placeholder="Palm Jumeirah, Dubai Marina..."
                                        value={formData.areas} onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Message / Requirements *</label>
                                <textarea
                                    name="message" className="form-textarea"
                                    placeholder="Tell us a bit more about what you're looking for..."
                                    required
                                    value={formData.message} onChange={handleInputChange}
                                ></textarea>
                            </div>

                            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                {isSubmitting ? 'Sending Enquiry...' : 'Submit Enquiry'}
                            </button>
                        </form>
                    </div>

                    {/* Reassurance Side */}
                    <div className="reassurance-panel">
                        <div className="reassurance-content">
                            <h3>Why Speak With Ophir?</h3>
                            <div className="benefits-list">
                                <div className="benefit-item">
                                    <CheckCircle2 className="benefit-check" size={24} />
                                    <div className="benefit-info">
                                        <h4>Curated Portfolios</h4>
                                        <p>Hand-picked properties that match your lifestyle and investment profile.</p>
                                    </div>
                                </div>
                                <div className="benefit-item">
                                    <CheckCircle2 className="benefit-check" size={24} />
                                    <div className="benefit-info">
                                        <h4>Transparent Advice</h4>
                                        <p>Data-driven market insights without the pushy sales tactics.</p>
                                    </div>
                                </div>
                                <div className="benefit-item">
                                    <CheckCircle2 className="benefit-check" size={24} />
                                    <div className="benefit-info">
                                        <h4>Off-Market Access</h4>
                                        <p>Exclusive access to premium listings not yet available on public portals.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="panel-footer">
                            <div className="stat-item">
                                <span className="stat-val">15+</span>
                                <span className="stat-lbl">Years Exp.</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-val">Dubai</span>
                                <span className="stat-lbl">Global HQ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Office Location */}
            <section className="office-section">
                <div className="office-container">
                    <div className="location-info">
                        <h2>Visit Our Office</h2>
                        <div className="address-block">
                            <span className="office-name">Ophir Properties HQ</span>
                            <p className="address-text">
                                Platinum Tower, Business Bay<br />
                                Dubai, United Arab Emirates
                            </p>
                        </div>

                        <div className="hours-block">
                            <span className="hours-title">Opening Hours</span>
                            <div className="hours-row">
                                <span>Mon - Fri</span>
                                <span>9:00 AM - 6:00 PM</span>
                            </div>
                            <div className="hours-row">
                                <span>Saturday</span>
                                <span>10:00 AM - 2:00 PM</span>
                            </div>
                            <div className="hours-row">
                                <span>Sunday</span>
                                <span className="gold-text">Closed</span>
                            </div>
                        </div>

                        <a href="https://maps.app.goo.gl/xcXbRaYaU5GiduYdA" target="_blank" rel="noopener noreferrer" className="view-details-btn" style={{ width: 'fit-content' }}>
                            Get Directions
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
                <h2>Need Quick Answers?</h2>
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
