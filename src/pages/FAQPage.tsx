import React from 'react';
import FAQ from '../components/FAQ';
import SEO from '../components/SEO';

const FAQPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="FAQ - Beauty by Vicky"
        description="Frequently asked questions about Beauty by Vicky makeup services, pricing, booking process, and what to expect during your session."
        keywords="makeup artist FAQ, makeup questions, bridal makeup FAQ, beauty services FAQ, makeup pricing"
        ogUrl="/faq"
      />
      <div className="min-h-screen">
        <FAQ />
      </div>
    </>
  );
};

export default FAQPage;
