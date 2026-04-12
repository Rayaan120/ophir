import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import './GlobalInsights.css';
import { useTheme } from '../ThemeContext';

const GlobalInsights = () => {
  const { t, i18n } = useTranslation();
  const { country } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [activeMarket, setActiveMarket] = useState('UK');

  // IDs match the keys in globalInsights.tabs
  const marketIds = ['uk', 'us', 'eu', 'tr', 'au', 'ca', 'kr'];

  // Mapping display keys to internal activeMarket state
  const marketMap = {
    uk: 'UK', us: 'US', eu: 'EU', tr: 'Turkey', au: 'Australia', ca: 'Canada', kr: 'Korea'
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    // Sync activeMarket with URL parameter
    if (country && marketIds.includes(country.toLowerCase())) {
      setActiveMarket(marketMap[country.toLowerCase()]);
    } else if (!country) {
      setActiveMarket('UK'); // Default
    }
  }, [country]);

  const handleTabClick = (id) => {
    const lang = i18n.language || 'en';
    navigate(`/${lang}/global-insights/${id}`);
  };

  const [expandedIndex, setExpandedIndex] = useState(0);

  const handleAccordionClick = (index) => {
    setExpandedIndex(index === expandedIndex ? -1 : index);
  };

  const renderUKInsight = () => {
    // Array of questions/answers
    const questions = t('globalInsights.uk.questions', { returnObjects: true }) || [];
    // Strategic Note object
    const strategicNote = t('globalInsights.uk.strategicNote', { returnObjects: true }) || {};
    // Expert Info object
    const expert = t('globalInsights.uk.expert', { returnObjects: true }) || {};

    return (
      <div className="uk-structured-insight animate-fade-in mt-8">

        {/* Intro Block */}
        <div className="content-block text-center mb-16" style={{ maxWidth: '800px', margin: '0 auto 4rem auto' }}>
          <h2 className="gold-text mb-6">{t('globalInsights.uk.title')}</h2>
          <p className="market-overview-text text-lg">
            {t('globalInsights.uk.intro')}
          </p>
        </div>

        {/* Accordion List */}
        <div className="accordion-container mb-20">
          {Array.isArray(questions) && questions.map((item, index) => (
            <div key={index} className={`accordion-item ${expandedIndex === index ? 'expanded' : ''}`}>

              <button className="accordion-header" onClick={() => handleAccordionClick(index)}>
                <h3>{item.q}</h3>
                <span className="accordion-icon">{expandedIndex === index ? '−' : '+'}</span>
              </button>

              <div className="accordion-content">
                <div className="accordion-content-inner pt-2">

                  {/* Answers Paragraphs */}
                  {Array.isArray(item.a) && item.a.map((paragraph, pIdx) => (
                    <p key={pIdx} className="mb-4">{paragraph}</p>
                  ))}

                  {/* Embedded Table */}
                  {item.table && (
                    <div className="comparison-table-wrapper mt-6 mb-6">
                      <table className="insights-table border-hidden-if-empty">
                        <thead>
                          <tr>
                            {item.table.headers && item.table.headers.map((h, hIdx) => (
                              <th key={hIdx} className={hIdx === item.table.headers.length - 1 ? 'gold-text' : ''}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {item.table.rows && item.table.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className={cIdx === row.length - 1 ? 'highlight' : ''}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Fact Checking Links */}
                  {item.links && item.links.length > 0 && (
                    <div className="mt-6 mb-2">
                      {item.links.map((link, lIdx) => (
                        <a key={lIdx} href={link.url} target="_blank" rel="noopener noreferrer" className="uk-gov-link block mt-2 text-sm" style={{ display: 'block' }}>
                          🔗 {link.text}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Verification Note */}
                  {item.verification && (
                    <p className="detail-text muted mt-4 italic text-sm">{item.verification}</p>
                  )}

                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Strategic Note */}
        <div className="content-block mt-16 mb-16">
          <div className="glass-panel p-8 md:p-12 strategic-note rounded-container text-center md:text-left">
            <h3 className="gold-text mb-6 text-2xl" style={{ fontSize: '1.75rem' }}>{strategicNote.title}</h3>
            <p className="detail-text muted mb-6" style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>{strategicNote.p1}</p>
            <p className="detail-text muted mb-6" style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>{strategicNote.p2}</p>
            <p className="detail-text" style={{ fontSize: '0.95rem', opacity: 0.8 }}>{strategicNote.p3}</p>
          </div>
        </div>

        {/* UK Investment Specialist */}
        <div className="expert-advisor-section mt-16 pt-12 border-t border-color-subtle">
          <div className="expert-card glass-panel animate-fade-in p-0 flex flex-col md:flex-row items-stretch" style={{ overflow: 'hidden' }}>
            {/* Removed empty image column to eliminate left-side gap */}

            <div className="expert-info flex-1 p-8 md:p-12 flex flex-col justify-center">
              <span className="small-label mb-3 inline-block">{expert.title}</span>
              <p className="muted mb-6 text-lg">{expert.desc}</p>

              <h2 className="mb-2 text-3xl font-heading">{expert.name}</h2>
              <p className="gold-text font-bold mb-6 tracking-wide uppercase text-sm">{expert.role}</p>

              <p className="mb-8 leading-relaxed">{expert.bio}</p>

              <div className="expert-actions flex gap-4 flex-wrap mt-8">
                <a href={`mailto:${expert.email}`} className="btn btn-primary" style={{ padding: '12px 24px' }}>
                  Email
                </a>
                <a href={expert.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline flex items-center gap-2" style={{ padding: '12px 24px' }}>
                  WhatsApp
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    );
  };

  const renderStandardInsight = () => {
    // Current market ID for translations
    const marketId = Object.keys(marketMap).find(key => marketMap[key] === activeMarket) || 'uk';
    const mName = t(`globalInsights.tabs.${marketId}`);

    return (
      <div className="placeholder-insight animate-fade-in glass-panel text-center rounded-container">
        <h2 className="gold-text mb-4">{t('globalInsights.placeholder.title', { name: mName })}</h2>
        <p className="detail-text muted text-lg">
          {t('globalInsights.placeholder.desc', { name: mName })}
        </p>
        <div className="mt-4">
          <span className="small-label">{t('globalInsights.placeholder.label')}</span>
          <p className="mt-1 text-sm">{t('globalInsights.placeholder.sub')}</p>
        </div>
        <div className="mt-8 flex justify-center">
          <div className="coming-soon-badge">
            Coming Soon
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`global-insights-page ${theme} ${i18n.language === 'ar' ? 'rtl' : ''}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>


      {/* Hero Section */}
      <section className="insights-hero" style={{ backgroundImage: "linear-gradient(to right, rgba(10, 10, 15, 0.95), rgba(10, 10, 15, 0.7), rgba(10, 10, 15, 0.5)), url('/insights/insights-hero.png')" }}>
        <div className="insights-hero-overlay"></div>
        <div className="insights-hero-content-wrapper animate-fade-in">
          <div className="insights-hero-content">
            <h1>{t('globalInsights.hero.title')}</h1>
            <p className="insights-hero-subtitle">
              {t('globalInsights.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Market Selector */}
      <section className="market-selector-section section-padding pb-0 pt-0">
        <div className="container">
          <div className="market-selector scroll-hide">
            {marketIds.map((id) => (
              <button
                key={id}
                className={`market-tab ${activeMarket === marketMap[id] ? 'active' : ''}`}
                onClick={() => handleTabClick(id)}
              >
                {t(`globalInsights.tabs.${id}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Content Section */}
      <section className="market-content-section pt-8 pb-20">
        <div className="container">
          {activeMarket === 'UK' ? renderUKInsight() : renderStandardInsight()}
        </div>
      </section>

    </div>
  );
};

export default GlobalInsights;
