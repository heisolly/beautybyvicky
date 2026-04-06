import React from 'react';
import Contact from '../components/Contact';
import SEO from '../components/SEO';

const ContactPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="Contact Us - Beauty by Vicky's"
        description="Get in touch with Beauty by Vicky's for makeup appointments, consultations, and inquiries. Located in Lagos, Nigeria."
        keywords="contact makeup artist, makeup studio Lagos, beauty salon contact, Vicky's makeup contact"
        ogUrl="/contact"
      />
      <div className="min-h-screen">
        <Contact />
      </div>
    </>
  );
};

export default ContactPage;
