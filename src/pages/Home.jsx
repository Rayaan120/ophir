import React from 'react';
import Hero from '../components/Hero';
import ExplorePrimeCommunities from '../components/ExplorePrimeCommunities';
import WhyChooseOphir from '../components/WhyChooseOphir';
import TrustedPartners from '../components/TrustedPartners';
import HowItWorks from '../components/HowItWorks';
import TestimonialsSection from '../components/TestimonialsSection';
import HotProperties from '../components/HotProperties';
import InstagramFeed from '../components/InstagramFeed';
import FinalCTA from '../components/FinalCTA';

const Home = () => {
    return (
        <div className="home-page-root">
            <Hero />
            <HotProperties />
            <ExplorePrimeCommunities />
            <WhyChooseOphir />
            <TrustedPartners />
            <HowItWorks />
            <TestimonialsSection />
            <InstagramFeed variant="premium" />
            <FinalCTA />
        </div>
    );
};

export default Home;
