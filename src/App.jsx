import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ThemeProvider } from './ThemeContext';
import Home from './pages/Home';
import About from './pages/About';
import BuyPage from './pages/BuyPage';
import RentPage from './pages/RentPage';
import NewProjectsPage from './pages/NewProjectsPage';
import PropertyDetails from './pages/PropertyDetails';
import ContactPage from './pages/ContactPage';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/buy" element={<BuyPage />} />
          <Route path="/rent" element={<RentPage />} />
          <Route path="/new-projects" element={<NewProjectsPage />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
        </Routes>
      </main>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
