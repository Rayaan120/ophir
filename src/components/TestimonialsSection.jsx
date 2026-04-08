import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);

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

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const testimonial = testimonials[currentIndex];

    return (
        <section className="testimonials-section section-padding">
            <div className="testimonials-container">
                <div className="testimonials-header">
                    <span className="small-label">{t('testimonials.label')}</span>
                    <h2 className="section-title">{t('testimonials.title')}</h2>
                </div>

                <div className="testimonial-slider-content">
                    <button className="slider-arrow prev" onClick={prevTestimonial} aria-label="Previous">
                        <ChevronLeft size={24} />
                    </button>

                    <div className="testimonial-card-single">
                        <div className="testimonial-bg-letter">O</div>
                        <div className="quote-icon">
                            <Quote size={48} fill="currentColor" />
                        </div>
                        
                        <div className="testimonial-body-centered">
                            <p className="testimonial-text-main">{testimonial.text}</p>
                            <span className="testimonial-author-name">— {testimonial.name}</span>
                        </div>
                    </div>

                    <button className="slider-arrow next" onClick={nextTestimonial} aria-label="Next">
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
