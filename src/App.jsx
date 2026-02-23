import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { ThemeProvider } from './ThemeContext';
import ExplorePrimeCommunities from './components/ExplorePrimeCommunities';
import WhyChooseOphir from './components/WhyChooseOphir';
import TrustedPartners from './components/TrustedPartners';
import HowItWorks from './components/HowItWorks';
import TestimonialsSection from './components/TestimonialsSection';
import HotProperties from './components/HotProperties';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <main>
        <Hero />
        <HotProperties />
        <ExplorePrimeCommunities />
        <WhyChooseOphir />
        <TrustedPartners />
        <HowItWorks />
        <TestimonialsSection />
        <FinalCTA />
      </main>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
