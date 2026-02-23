import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import './ExplorePrimeCommunities.css';

const ExplorePrimeCommunities = () => {
    const [activeId, setActiveId] = useState(1);

    const communities = [
        {
            id: 1,
            name: 'Dubai',
            desc: 'The global epicenter of ultra-luxury living, futuristic architecture, and unrivaled investment prestige.',
            img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop', // Downtown Dubai skyline
            listings: '120+ Premium Properties'
        },
        {
            id: 2,
            name: 'Abu Dhabi',
            desc: 'A harmonious blend of rich cultural heritage, serene island sanctuaries, and refined grandeur.',
            img: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?q=80&w=2070&auto=format&fit=crop', // Grand Mosque/Abu Dhabi architecture
            listings: '85+ Premium Properties'
        },
        {
            id: 3,
            name: 'Ras Al Khaimah',
            desc: 'The emerging haven of natural beauty, offering exclusive beachfront retreats and tranquil luxury.',
            img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop', // Beautiful beach/ocean home
            listings: '40+ Premium Properties'
        }
    ];

    return (
        <section className="explore-cinematic-section">
            {/* Cinematic Background Crossfader */}
            {communities.map((item) => (
                <motion.div
                    key={`bg-${item.id}`}
                    className="cinematic-bg"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{
                        opacity: activeId === item.id ? 1 : 0,
                        scale: activeId === item.id ? 1 : 1.05
                    }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    style={{ backgroundImage: `url(${item.img})` }}
                />
            ))}

            <div className="cinematic-overlay"></div>

            <div className="container relative z-10 h-full">
                <div className="cinematic-content">

                    {/* Left: Oversized Typography Navigation */}
                    <div className="cinematic-nav">
                        <div className="nav-header fade-in">
                            <span className="small-label text-gold uppercase tracking-widest text-sm font-semibold mb-2 block">
                                Explore the Emirates
                            </span>
                            <p className="text-gray-300 text-sm max-w-xs mb-10 leading-relaxed">
                                Curated investments across the nation's most prestigious and sought-after landscapes
                            </p>
                        </div>

                        <div className="nav-list">
                            {communities.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`nav-item ${activeId === item.id ? 'active' : ''}`}
                                    onMouseEnter={() => setActiveId(item.id)}
                                    // onClick fallback for mobile
                                    onClick={() => setActiveId(item.id)}
                                >
                                    <span className="nav-num">0{index + 1}</span>
                                    <h2 className="nav-title">{item.name}</h2>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Glassmorphic Details Panel */}
                    <div className="cinematic-info-wrapper">
                        <AnimatePresence mode="wait">
                            {communities.map(item => item.id === activeId && (
                                <motion.div
                                    key={`info-${item.id}`}
                                    className="cinematic-glass-card"
                                    initial={{ opacity: 0, x: 40, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, x: -20, filter: "blur(10px)", transition: { duration: 0.3 } }}
                                    transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                                >
                                    <span className="gold-badge">{item.listings}</span>
                                    <h3 className="card-title">{item.name}</h3>
                                    <p className="card-desc">{item.desc}</p>

                                    <div className="explore-btn-wrapper">
                                        <button className="btn btn-primary cinematic-btn">
                                            <span>Explore {item.name}</span>
                                            <ArrowRight size={20} className="btn-icon" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ExplorePrimeCommunities;
