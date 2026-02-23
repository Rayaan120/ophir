import { CheckCircle, Quote } from 'lucide-react';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
    const testimonials = [
        {
            id: 1,
            name: 'A. Rahman',
            label: 'Private Investor – Dubai Marina',
            text: 'Ophir properties completely shifted my approach to real estate. Their off-market insights allowed me to secure a penthouse that appreciated by 20% before handover.',
            num: '01'
        },
        {
            id: 2,
            name: 'Sarah Mitchell',
            label: 'Expat Executive – Downtown Dubai',
            text: 'The level of professionalism and the curated options provided were unparalleled. They understood exactly what my family needed for a long-term premium residence.',
            num: '02'
        },
        {
            id: 3,
            name: 'H. Al Maktoum',
            label: 'Portfolio Manager – Palm Jumeirah',
            text: 'A seamless acquisition process. Their advisory team navigated complex legal structures effortlessly, allowing us to expand our waterfront portfolio with confidence.',
            num: '03'
        },
        {
            id: 4,
            name: 'David Chen',
            label: 'International Buyer',
            text: 'Investing from abroad can be daunting, but Ophir provided comprehensive data, virtual tours, and legal clarity that made the transaction incredibly smooth.',
            num: '04'
        }
    ];

    const duplicateGroups = [1, 2, 3, 4]; // 4 groups to ensure enough width for large screens

    return (
        <section className="testimonials-section section-padding">
            <div className="container">
                <div className="testimonials-header">
                    <span className="small-label" style={{ textAlign: 'center' }}>Client Experiences</span>
                    <h2 className="section-title">Testimonials & Investors</h2>
                    <div className="gold-line center-line"></div>
                </div>
            </div>

            <div className="testimonials-marquee-container">
                <div className="testimonials-marquee-track">
                    {duplicateGroups.map((groupId) => (
                        <div
                            key={groupId}
                            className="marquee-group"
                            aria-hidden={groupId > 1 ? "true" : "false"}
                        >
                            {testimonials.map((t, idx) => (
                                <div key={`${groupId}-${idx}`} className="testimonial-card-wrapper">
                                    <div className="testimonial-card glass-panel group-hover-effect">
                                        <div className="test-header">
                                            <div className="quote-icon-wrapper">
                                                <Quote size={20} className="gold-quote" />
                                            </div>
                                            <div>
                                                <h4>{t.name}</h4>
                                                <span className="test-label">{t.label}</span>
                                            </div>
                                        </div>

                                        <div className="test-body">
                                            <p>{t.text}</p>
                                            <span className="quote-mark">”</span>
                                        </div>

                                        <div className="test-footer">
                                            <div className="verified">
                                                <CheckCircle size={16} color="#d4af37" />
                                                <span>Verified Client</span>
                                            </div>
                                            <span className="test-num">{t.num}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
