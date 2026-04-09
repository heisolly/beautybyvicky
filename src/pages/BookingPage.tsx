import React from 'react';
import BookingSystem from '../components/BookingSystem';
import SEO from '../components/SEO';

const BookingPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="Book Your Session - Beauty by Vicky"
        description="Schedule your makeup appointment with Beauty by Vicky. Choose from bridal, special events, photoshoot, and makeup lesson services."
        keywords="book makeup appointment, makeup booking Lagos, bridal makeup booking, professional makeup scheduling"
        ogUrl="/booking"
      />
      <div className="min-h-screen">
        <BookingSystem />
      </div>
    </>
  );
};

export default BookingPage;
