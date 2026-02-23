import { Search, Eye, FileCheck } from 'lucide-react';
import './HowItWorks.css';

const HowItWorks = () => {
    const steps = [
        {
            id: '01',
            icon: <Search size={28} color="#d4af37" />,
            title: 'Discover Strategic Opportunities',
            desc: 'We map the market to your investment goals, presenting only vetted, high-yield assets.'
        },
        {
            id: '02',
            icon: <Eye size={28} color="#d4af37" />,
            title: 'Private Viewings & Evaluation',
            desc: 'Exclusive access, rigorous due diligence, and comprehensive valuation models.'
        },
        {
            id: '03',
            icon: <FileCheck size={28} color="#d4af37" />,
            title: 'Secure & Structured Transaction',
            desc: 'Seamless legal and financial execution for rapid, compliant ownership transfer.'
        }
    ];

    return (
        <section className="process-section section-padding">
            <div className="container">
                <div className="process-wrapper rounded-container">

                    <div className="process-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541888078693-5ba9d1b091e9?q=80&w=2070&auto=format&fit=crop')" }}>
                    </div>
                    <div className="process-overlay"></div>

                    <div className="process-content-area">

                        {/* Left: Text & CTA */}
                        <div className="process-info">
                            <div className="gold-accent-line"></div>
                            <h2 className="section-title">How We Guide Your Property Journey</h2>
                            <p className="process-desc">
                                From initial discovery to final handover, Ophir provides a white-glove advisory service designed to protect and compound your wealth perfectly.
                            </p>
                            <button className="btn btn-primary" style={{ marginTop: '20px' }}>
                                Schedule a Consultation
                            </button>
                        </div>

                        {/* Right: Step Cards */}
                        <div className="process-cards glass-panel">
                            {steps.map((step, idx) => (
                                <div key={idx} className="process-card">
                                    <div className="step-header">
                                        <span className="step-id">{step.id}</span>
                                        <div className="step-icon">{step.icon}</div>
                                    </div>
                                    <h3>{step.title}</h3>
                                    <p>{step.desc}</p>
                                </div>
                            ))}
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
