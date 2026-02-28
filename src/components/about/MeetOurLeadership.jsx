import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Phone, MessageCircle } from 'lucide-react';
import './About.css';

const MeetOurLeadership = () => {
    const sliderRef = useRef(null);

    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -350, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 350, behavior: 'smooth' });
        }
    };

    const team = [
        {
            name: "Alexander Vance",
            role: "Managing Director",
            bio: "15+ years in UAE market, specialist in luxury and off-market assets. Strategic visionary behind Ophir's advisory approach.",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            name: "Elena Rostova",
            role: "Head of Investments",
            bio: "Expert in ROI optimization and high-yield property curation. Over a decade advising global institutional and private wealth.",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            name: "Omar Tariq",
            role: "Director of Off-Plan",
            bio: "Leading developer relationships and pre-launch strategies. Deep network across Dubai's top tier master developers.",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            name: "Sarah Lin",
            role: "Client Advisory Lead",
            bio: "Focusing on bespoke client experiences and long-term portfolio management for ultra-high-net-worth individuals.",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ];

    return (
        <section className="about-section team-section-bg">
            <div className="about-container team-layout">

                {/* Left Panel */}
                <div className="team-intro">
                    <h2 className="section-title">Meet Our Leadership</h2>
                    <div className="gold-accent-line"></div>
                    <p className="team-desc">
                        Decades of combined experience in UAE real estate. <br />
                        Strategic investment expertise driven by a client-first advisory ethos.
                    </p>

                    <div className="slider-nav">
                        <button className="slider-nav-btn" onClick={scrollLeft} aria-label="Previous">
                            <ChevronLeft size={24} />
                        </button>
                        <button className="slider-nav-btn" onClick={scrollRight} aria-label="Next">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* Right Slider */}
                <div className="team-slider-container">
                    <div className="team-slider" ref={sliderRef}>
                        {team.map((member, idx) => (
                            <div key={idx} className="team-card">
                                <div className="team-card-image-wrapper">
                                    <img src={member.image} alt={member.name} className="team-card-image" />
                                </div>
                                <div className="team-card-content">
                                    <h3 className="team-card-name">{member.name}</h3>
                                    <p className="team-card-role">{member.role}</p>
                                    <p className="team-card-bio">{member.bio}</p>

                                    <div className="team-card-actions">
                                        <button className="view-details-btn">View Details</button>
                                        <div className="contact-icons">
                                            <button className="contact-icon-btn"><Phone size={18} /></button>
                                            <button className="contact-icon-btn whatsapp-icon"><MessageCircle size={18} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default MeetOurLeadership;
