import React from 'react';
import Services from '../components/Services';
import SEO from '../components/SEO';

const ServicesPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="Our Services - Beauty by Vicky's"
        description="Explore our premium makeup services including bridal makeup, special events, photoshoots, and professional makeup lessons in Lagos."
        keywords="bridal makeup Lagos, events makeup, photoshoot makeup, makeup lessons, professional makeup services"
        ogUrl="/services"
      />
      <div className="min-h-screen">
        <Services />
      </div>
    </>
  );
};

export default ServicesPage;
