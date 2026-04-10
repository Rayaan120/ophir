import { Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
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
