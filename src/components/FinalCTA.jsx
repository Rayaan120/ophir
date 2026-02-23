import './FinalCTA.css';

const FinalCTA = () => {
    return (
        <section className="final-cta-section">
            <div className="final-cta-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2069&auto=format&fit=crop')" }}></div>
            <div className="final-cta-overlay"></div>

            <div className="container final-cta-container">
                <div className="final-cta-content animate-fade-in">
                    <span className="small-label" style={{ textAlign: 'center', margin: '0 auto 16px auto' }}>Ready to Invest?</span>
                    <h2 className="cta-title">
                        Your Next Strategic Investment<br />Starts with Ophir.
                    </h2>
                    <p className="cta-subtitle">
                        Experience tailored advisory and gain access to curated opportunities that align perfectly with your wealth preservation and growth objectives.
                    </p>
                    <div className="cta-actions">
                        <button className="btn btn-primary">Schedule a Consultation</button>
                        <button className="btn btn-outline">Explore Exclusive Listings</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
