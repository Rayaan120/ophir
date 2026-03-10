import { CheckCircle, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
    const { t } = useTranslation();
    const testimonials = [
        {
            id: 1,
            name: t('testimonials.t1Name'),
            label: t('testimonials.t1Role'),
            text: t('testimonials.t1Text'),
            num: '01'
        },
        {
            id: 2,
            name: t('testimonials.t2Name'),
            label: t('testimonials.t2Role'),
            text: t('testimonials.t2Text'),
            num: '02'
        },
        {
            id: 3,
            name: t('testimonials.t3Name'),
            label: t('testimonials.t3Role'),
            text: t('testimonials.t3Text'),
            num: '03'
        },
        {
            id: 4,
            name: t('testimonials.t4Name'),
            label: t('testimonials.t4Role'),
            text: t('testimonials.t4Text'),
            num: '04'
        },
        {
            id: 5,
            name: t('testimonials.t5Name'),
            label: t('testimonials.t5Role'),
            text: t('testimonials.t5Text'),
            num: '05'
        },
        {
            id: 6,
            name: t('testimonials.t6Name'),
            label: t('testimonials.t6Role'),
            text: t('testimonials.t6Text'),
            num: '06'
        }
    ];

    const duplicateGroups = [1, 2, 3]; // 3 groups to ensure enough width for large screens

    return (
        <section className="testimonials-section section-padding">
            <div className="container">
                <div className="testimonials-header">
                    <span className="small-label" style={{ textAlign: 'center' }}>{t('testimonials.label')}</span>
                    <h2 className="section-title">
                        {t('testimonials.title').split('&').map((text, i, arr) => (
                            <span key={i}>
                                {text}
                                {i < arr.length - 1 && <span className="normal-amp">&</span>}
                            </span>
                        ))}
                    </h2>
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
                            {testimonials.map((testimonial, idx) => (
                                <div key={`${groupId}-${idx}`} className="testimonial-card-wrapper">
                                    <div className="testimonial-card glass-panel group-hover-effect">
                                        <div className="test-header">
                                            <div className="quote-icon-wrapper">
                                                <Quote size={20} className="gold-quote" />
                                            </div>
                                            <div>
                                                <h4>{testimonial.name}</h4>
                                                <span className="test-label">{testimonial.label}</span>
                                            </div>
                                        </div>

                                        <div className="test-body">
                                            <p>{testimonial.text}</p>
                                            <span className="quote-mark">”</span>
                                        </div>

                                        <div className="test-footer">
                                            <div className="verified">
                                                <CheckCircle size={16} className="test-verified-icon" />
                                                <span>{t('testimonials.verified')}</span>
                                            </div>
                                            <span className="test-num">{testimonial.num}</span>
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
