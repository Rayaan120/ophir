import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './GlobalInsights.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useTheme } from '../ThemeContext';



const GlobalInsights = () => {
  const { t, i18n } = useTranslation();
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
  }, []);

  const renderUKInsight = () => {
    return (
      <div className="uk-structured-insight animate-fade-in mt-8">
        <div className="market-grid">
          {/* Left Column */}
          <div className="market-left">
            <div className="content-block">
              <span className="small-label">{t('globalInsights.uk.sections.s1')}</span>
              <h2 className="gold-text mb-4">{t('globalInsights.uk.title')}</h2>
              <div className="market-overview-text">
                <p>{t('globalInsights.uk.overview.p1')}</p>
                <p className="mt-4">{t('globalInsights.uk.overview.p2')}</p>
              </div>
            </div>

            <div className="content-block mt-12">
              <span className="small-label">{t('globalInsights.uk.sections.s3')}</span>
              <h3>{t('globalInsights.uk.regulations.title')}</h3>
              <p className="detail-text muted mt-2 mb-6">{t('globalInsights.uk.regulations.desc')}</p>
              
              <div className="comparison-table-wrapper">
                <table className="insights-table">
                  <thead>
                    <tr>
                      <th>{t('globalInsights.uk.regulations.table.h1')}</th>
                      <th>{t('globalInsights.uk.regulations.table.h2')}</th>
                      <th className="gold-text">{t('globalInsights.uk.regulations.table.h3')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{t('globalInsights.uk.regulations.table.r1')}</td>
                      <td>{t('globalInsights.uk.regulations.table.r1UK')}</td>
                      <td className="highlight">{t('globalInsights.uk.regulations.table.r1DXB')}</td>
                    </tr>
                    <tr>
                      <td>{t('globalInsights.uk.regulations.table.r2')}</td>
                      <td>{t('globalInsights.uk.regulations.table.r2UK')}</td>
                      <td className="highlight">{t('globalInsights.uk.regulations.table.r2DXB')}</td>
                    </tr>
                    <tr>
                      <td>{t('globalInsights.uk.regulations.table.r3')}</td>
                      <td>{t('globalInsights.uk.regulations.table.r3UK')}</td>
                      <td className="highlight">{t('globalInsights.uk.regulations.table.r3DXB')}</td>
                    </tr>
                    <tr>
                      <td>{t('globalInsights.uk.regulations.table.r4')}</td>
                      <td>{t('globalInsights.uk.regulations.table.r4UK')}</td>
                      <td className="highlight">{t('globalInsights.uk.regulations.table.r4DXB')}</td>
                    </tr>
                  </tbody>
                </table>
                <a href="https://www.gov.uk/government/publications/guide-to-the-renters-rights-bill" target="_blank" rel="noopener noreferrer" className="uk-gov-link mt-2 inline-block">
                  {t('globalInsights.uk.regulations.ref')}
                </a>
              </div>
            </div>

            <div className="content-block mt-12">
              <span className="small-label">{t('globalInsights.uk.sections.s5')}</span>
              <h3>{t('globalInsights.uk.currency.title')}</h3>
              <p className="detail-text muted mt-2 mb-6">{t('globalInsights.uk.currency.desc')}</p>
              
              <div className="comparison-table-wrapper">
                <table className="insights-table">
                  <thead>
                    <tr>
                      <th>{t('globalInsights.uk.currency.table.h1')}</th>
                      <th>{t('globalInsights.uk.currency.table.h2')}</th>
                      <th className="gold-text">{t('globalInsights.uk.currency.table.h3')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{t('globalInsights.uk.currency.table.r1')}</td>
                      <td>{t('globalInsights.uk.currency.table.r1UK')}</td>
                      <td className="highlight">{t('globalInsights.uk.currency.table.r1DXB')}</td>
                    </tr>
                    <tr>
                      <td>{t('globalInsights.uk.currency.table.r2')}</td>
                      <td>{t('globalInsights.uk.currency.table.r2UK')}</td>
                      <td className="highlight">{t('globalInsights.uk.currency.table.r2DXB')}</td>
                    </tr>
                    <tr>
                      <td>{t('globalInsights.uk.currency.table.r3')}</td>
                      <td>{t('globalInsights.uk.currency.table.r3UK')}</td>
                      <td className="highlight">{t('globalInsights.uk.currency.table.r3DXB')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="content-block mt-12">
              <span className="small-label">{t('globalInsights.uk.sections.s7')}</span>
              <h3>{t('globalInsights.uk.financing.title')}</h3>
              <ul className="insights-list mt-4 mb-6">
                <li><span className="gold-text">✓</span> {t('globalInsights.uk.financing.list1')}</li>
                <li><span className="gold-text">✓</span> {t('globalInsights.uk.financing.list2')}</li>
                <li><span className="gold-text">✓</span> {t('globalInsights.uk.financing.list3')}</li>
              </ul>
              
              <div className="comparison-table-wrapper">
                <table className="insights-table">
                  <thead>
                    <tr>
                      <th>{t('globalInsights.uk.financing.table.h1')}</th>
                      <th>{t('globalInsights.uk.financing.table.h2')}</th>
                      <th>{t('globalInsights.uk.financing.table.h3')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{t('globalInsights.uk.financing.table.p1')}</td>
                      <td>{t('globalInsights.uk.financing.table.p1A')}</td>
                      <td>{t('globalInsights.uk.financing.table.p1T')}</td>
                    </tr>
                    <tr>
                      <td>{t('globalInsights.uk.financing.table.p2')}</td>
                      <td>{t('globalInsights.uk.financing.table.p2A')}</td>
                      <td>{t('globalInsights.uk.financing.table.p2T')}</td>
                    </tr>
                    <tr>
                      <td>{t('globalInsights.uk.financing.table.p3')}</td>
                      <td>{t('globalInsights.uk.financing.table.p3A')}</td>
                      <td>{t('globalInsights.uk.financing.table.p3T')}</td>
                    </tr>
                    <tr>
                      <td>{t('globalInsights.uk.financing.table.p4')}</td>
                      <td>{t('globalInsights.uk.financing.table.p4A')}</td>
                      <td>{t('globalInsights.uk.financing.table.p4T')}</td>
                    </tr>
                    <tr>
                      <td>{t('globalInsights.uk.financing.table.p5')}</td>
                      <td>{t('globalInsights.uk.financing.table.p5A')}</td>
                      <td>{t('globalInsights.uk.financing.table.p5T')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="market-right">
            <div className="content-block">
              <span className="small-label">{t('globalInsights.uk.sections.s2')}</span>
              <h3>{t('globalInsights.uk.investCompare.q')}</h3>
              <p className="detail-text muted mt-2 mb-6">{t('globalInsights.uk.investCompare.desc')}</p>
              
              <div className="comparison-table-wrapper">
                <table className="insights-table">
                  <thead>
                    <tr>
                      <th>{t('globalInsights.uk.investCompare.table.h1')}</th>
                      <th>{t('globalInsights.uk.investCompare.table.h2')}</th>
                      <th className="gold-text">{t('globalInsights.uk.investCompare.table.h3')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{t('globalInsights.uk.investCompare.table.r1')}</td>
                      <td>3%–5%</td>
                      <td className="highlight">6%–10%</td>
                    </tr>
                    <tr>
                      <td>{t('globalInsights.uk.investCompare.table.r2')}</td>
                      <td>20–45%</td>
                      <td className="highlight">0%</td>
                    </tr>
                    <tr>
                      <td>{t('globalInsights.uk.investCompare.table.r3')}</td>
                      <td>18–24%</td>
                      <td className="highlight">0%</td>
                    </tr>
                    <tr>
                      <td>{t('globalInsights.uk.investCompare.table.r4')}</td>
                      <td>{t('globalInsights.uk.investCompare.table.v4UK')}</td>
                      <td className="highlight">{t('globalInsights.uk.investCompare.table.v4DXB')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="content-block mt-12">
              <span className="small-label">{t('globalInsights.uk.sections.s4')}</span>
              <h3>{t('globalInsights.uk.tax.title')}</h3>
              <p className="detail-text muted mt-2 mb-6">{t('globalInsights.uk.tax.desc')}</p>
              
              <div className="comparison-table-wrapper">
                <table className="insights-table">
                  <thead>
                    <tr>
                      <th>{t('globalInsights.uk.tax.table.h1')}</th>
                      <th>{t('globalInsights.uk.tax.table.h2')}</th>
                      <th className="gold-text">{t('globalInsights.uk.tax.table.h3')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{t('globalInsights.uk.tax.table.r1')}</td>
                      <td>{t('globalInsights.uk.tax.table.r1UK')}</td>
                      <td className="highlight">{t('globalInsights.uk.tax.table.r1DXB')}</td>
                    </tr>
                    <tr>
                      <td>{t('globalInsights.uk.tax.table.r2')}</td>
                      <td>{t('globalInsights.uk.tax.table.r2UK')}</td>
                      <td className="highlight">{t('globalInsights.uk.tax.table.r2DXB')}</td>
                    </tr>
                    <tr>
                      <td>{t('globalInsights.uk.tax.table.r3')}</td>
                      <td>{t('globalInsights.uk.tax.table.r3UK')}</td>
                      <td className="highlight">{t('globalInsights.uk.tax.table.r3DXB')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="content-block mt-12">
              <span className="small-label">{t('globalInsights.uk.sections.s6')}</span>
              <h3>{t('globalInsights.uk.visa.title')}</h3>
              <div className="insight-highlight-card glass-panel mt-6 mb-6">
                <div className="quote-icon">"</div>
                <p>{t('globalInsights.uk.visa.quote')}</p>
              </div>
              
              <div className="comparison-table-wrapper">
                <table className="insights-table">
                  <thead>
                    <tr>
                      <th>{t('globalInsights.uk.visa.table.h1')}</th>
                      <th>{t('globalInsights.uk.visa.table.h2')}</th>
                      <th className="gold-text">{t('globalInsights.uk.visa.table.h3')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{t('globalInsights.uk.visa.table.r1')}</td>
                      <td>{t('globalInsights.uk.visa.table.r1UK')}</td>
                      <td className="highlight">{t('globalInsights.uk.visa.table.r1DXB')}</td>
                    </tr>
                    <tr>
                      <td>{t('globalInsights.uk.visa.table.r2')}</td>
                      <td>{t('globalInsights.uk.visa.table.r2UK')}</td>
                      <td className="highlight">{t('globalInsights.uk.visa.table.r2DXB')}</td>
                    </tr>
                    <tr>
                      <td>{t('globalInsights.uk.visa.table.r3')}</td>
                      <td>{t('globalInsights.uk.visa.table.r3UK')}</td>
                      <td className="highlight">{t('globalInsights.uk.visa.table.r3DXB')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="content-block mt-12">
              <span className="small-label">{t('globalInsights.uk.sections.s8')}</span>
              <div className="glass-panel p-6 rounded-container" style={{ padding: '24px' }}>
                <h3 className="gold-text mb-4">{t('globalInsights.uk.strategic.title')}</h3>
                <p className="detail-text muted">
                  {t('globalInsights.uk.strategic.p1')}
                  <br/><br/>
                  <small>{t('globalInsights.uk.strategic.disclaimer')}</small>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* UK Investment Specialist */}
        <div className="expert-advisor-section mt-16 pt-8 border-t border-color-subtle">
          <div className="expert-card glass-panel animate-fade-in">
            <div className="expert-image-container" style={{ flex: '0 0 300px', backgroundImage: 'url("/team/nimesh.jpg")' }}>
               <div className="expert-avatar-placeholder text-center p-6"></div>
            </div>
            <div className="expert-info">
              <span className="small-label">{t('globalInsights.uk.sections.s9')}</span>
              <h2>{t('globalInsights.uk.expert.name')}</h2>
              <p className="gold-text font-bold mb-4">{t('globalInsights.uk.expert.role')}</p>
              <p>{t('globalInsights.uk.expert.p')}</p>
              <div className="expert-actions mt-6">
                <a href="mailto:nimesh.visram@ophir-properties.com" className="btn btn-primary">{t('globalInsights.uk.expert.btn1')}</a>
                <a href="https://wa.me/447758953106" target="_blank" rel="noopener noreferrer" className="btn btn-outline ml-4">{t('globalInsights.uk.expert.btn2')}</a>
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
      <div className="placeholder-insight animate-fade-in glass-panel p-12 text-center rounded-container">
        <h2 className="gold-text mb-4">{t('globalInsights.placeholder.title', { name: mName })}</h2>
        <p className="detail-text muted text-lg">
          {t('globalInsights.placeholder.desc', { name: mName })}
        </p>
        <div className="mt-8">
          <span className="small-label">{t('globalInsights.placeholder.label')}</span>
          <p className="mt-2">{t('globalInsights.placeholder.sub')}</p>
        </div>
        <div className="mt-10">
          <a href="/contact" className="btn btn-primary">{t('globalInsights.placeholder.btn')}</a>
        </div>
      </div>
    );
  };

  return (
    <div className={`global-insights-page ${theme} ${i18n.language === 'ar' ? 'rtl' : ''}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />

      {/* Hero Section */}
      <section className="insights-hero">
        <div className="insights-hero-overlay"></div>
        <div className="container relative z-10">
          <div className="insights-hero-content animate-fade-in">
            <span className="small-label">{t('globalInsights.hero.label')}</span>
            <h1>{t('globalInsights.hero.title')}</h1>
            <p className="hero-subtitle">
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
                onClick={() => setActiveMarket(marketMap[id])}
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

      <Footer />
    </div>
  );
};

export default GlobalInsights;
