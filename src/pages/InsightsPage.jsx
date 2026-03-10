import React from 'react';
import InstagramFeed from '../components/InstagramFeed';
import './InsightsPage.css';

const InsightsPage = () => {
    return (
        <div className="insights-page">
            {/* Hero Section */}
            <section className="insights-hero">
                <div className="insights-hero-content animate-fade-in">
                    <span className="small-label">Market Intelligence</span>
                    <h1>Ophir Insights</h1>
                    <p>Navigating the UAE real estate landscape with institutional-grade research and strategic analysis.</p>
                </div>
            </section>

            <div className="container insights-main-content">
                <div className="insights-grid">

                    {/* Main Content Area */}
                    <main className="insights-articles">
                        <article className="featured-news-card">
                            <img
                                src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80"
                                alt="Dubai Skyline"
                                className="featured-news-image"
                            />
                            <div className="featured-news-content">
                                <span className="news-tag">Market Report</span>
                                <h2 className="news-title">Dubai 2040 Vision: Strategic Growth Corridors</h2>
                                <p className="news-excerpt">
                                    An in-depth analysis of how the UAE's urban master plan is reshaping investment potential in secondary hubs and emerging residential districts.
                                </p>
                                <button className="btn btn-outline">Read Full Report</button>
                            </div>
                        </article>

                        <div className="article-grid">
                            {[
                                {
                                    title: "The Rise of Ras Al Khaimah",
                                    cat: "Emerging Markets",
                                    img: "https://images.unsplash.com/photo-1626078299034-9337424ad419?auto=format&fit=crop&w=800&q=80"
                                },
                                {
                                    title: "Capital Gains vs Rental Yield",
                                    cat: "Strategy",
                                    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="article-card">
                                    <img src={item.img} alt={item.title} className="article-image" />
                                    <div className="article-content">
                                        <span className="small-label" style={{ marginBottom: '8px' }}>{item.cat}</span>
                                        <h3 className="article-title">{item.title}</h3>
                                        <button className="btn-link gold-text" style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Learn More</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>

                    {/* Sidebar Area */}
                    <aside className="insights-sidebar">

                        {/* Compact Instagram Widget */}
                        <div className="sidebar-widget">
                            <InstagramFeed variant="compact" />
                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <a href="https://instagram.com/ophirproperties" target="_blank" rel="noopener noreferrer" className="btn-link" style={{ fontSize: '0.85rem' }}>
                                    Follow Us @ophirproperties
                                </a>
                            </div>
                        </div>

                        {/* Newsletter Widget */}
                        <div className="sidebar-widget">
                            <h3 className="widget-title">The Investor's Edge</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                                get weekly strategic market updates delivered directly to your inbox.
                            </p>
                            <input type="email" placeholder="Email Address" className="newsletter-input" />
                            <button className="btn btn-primary" style={{ width: '100%' }}>Subscribe</button>
                        </div>

                    </aside>
                </div>
            </div>
        </div>
    );
};

export default InsightsPage;
