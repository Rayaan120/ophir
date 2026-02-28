import React from 'react';
import Hero from '../components/Hero';
import ExplorePrimeCommunities from '../components/ExplorePrimeCommunities';
import WhyChooseOphir from '../components/WhyChooseOphir';
import TrustedPartners from '../components/TrustedPartners';
import HowItWorks from '../components/HowItWorks';
import TestimonialsSection from '../components/TestimonialsSection';
import HotProperties from '../components/HotProperties';
import FinalCTA from '../components/FinalCTA';

const Home = () => {
    return (
        <>
            <Hero />
            <HotProperties />
            <ExplorePrimeCommunities />
            <WhyChooseOphir />
            <TrustedPartners />
            <HowItWorks />
            <TestimonialsSection />
            <FinalCTA />
        </>
    );
};

export default Home;
