import React, { useEffect } from 'react';
import AboutHero from '../components/about/AboutHero';
import OurStory from '../components/about/OurStory';
import MeetOurLeadership from '../components/about/MeetOurLeadership';
import OurCoreValues from '../components/about/OurCoreValues';
import OurMissionVision from '../components/about/OurMissionVision';
import TestimonialsSection from '../components/TestimonialsSection';
import AboutFinalCTA from '../components/about/AboutFinalCTA';

const About = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    return (
        <div className="about-page">
            <AboutHero />
            <OurStory />
            <OurMissionVision />
            <OurCoreValues />
            <MeetOurLeadership />
            <TestimonialsSection />
            <AboutFinalCTA />
        </div>
    );
};

export default About;
