import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import Home from './pages/Home';
import About from './pages/About';
import BuyPage from './pages/BuyPage';
import RentPage from './pages/RentPage';
import NewProjectsPage from './pages/NewProjectsPage';
import ServicesPage from './pages/ServicesPage';
import PropertyDetails from './pages/PropertyDetails';
import ContactPage from './pages/ContactPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import GlobalInsights from './pages/GlobalInsights';
import HotOffers from './pages/HotOffers';
import CommunitiesPage from './pages/CommunitiesPage';
import LanguageWrapper from './components/LanguageWrapper';
import LanguageRedirect from './components/LanguageRedirect';
import GlobalGradients from './components/GlobalGradients';

const GA_MEASUREMENT_ID = 'G-137SFQE00V';
let lastTrackedPath = '';

function GoogleAnalyticsPageViews() {
  const location = useLocation();

  useEffect(() => {
    const pagePath = `${location.pathname}${location.search}`;

    if (pagePath === lastTrackedPath || typeof window.gtag !== 'function') {
      return;
    }

    const trackPageView = window.setTimeout(() => {
      lastTrackedPath = pagePath;
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pagePath,
        page_location: window.location.href,
        page_title: document.title,
      });
    }, 0);

    return () => window.clearTimeout(trackPageView);
  }, [location.pathname, location.search]);

  return null;
}

function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <GoogleAnalyticsPageViews />
        <GlobalGradients />
        <Routes>
          <Route path="/" element={<LanguageRedirect />} />
          <Route path="/:lang" element={<LanguageWrapper />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="buy" element={<BuyPage />} />
            <Route path="rent" element={<RentPage />} />
            <Route path="new-projects" element={<NewProjectsPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="property/:id" element={<PropertyDetails />} />
            <Route path="global-insights/:country?" element={<GlobalInsights />} />
            <Route path="hot-offers" element={<HotOffers />} />
            <Route path="communities" element={<CommunitiesPage />} />
          </Route>
        </Routes>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
