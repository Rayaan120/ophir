import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ExplorePrimeCommunities from './components/ExplorePrimeCommunities';
import WhyChooseOphir from './components/WhyChooseOphir';
import TrustedPartners from './components/TrustedPartners';
import HowItWorks from './components/HowItWorks';
import TestimonialsSection from './components/TestimonialsSection';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ExplorePrimeCommunities />
        <WhyChooseOphir />
        <TrustedPartners />
        <HowItWorks />
        <TestimonialsSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

export default App;
