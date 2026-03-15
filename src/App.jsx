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
import LanguageWrapper from './components/LanguageWrapper';
import LanguageRedirect from './components/LanguageRedirect';

function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
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
            <Route path="global-insights" element={<GlobalInsights />} />
          </Route>
        </Routes>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
