import React from 'react';
import Hero from '../components/Hero';
import SEO from '../components/SEO';

const HomePage: React.FC = () => {
  return (
    <>
      <SEO 
        title="Beauty by Vicky's — Luxury Makeup Artist in Lagos"
        description="Experience the finest makeup artistry in Lagos. Specializing in bridal, editorial, and glam looks that enhance your natural beauty."
      />
      <div className="min-h-screen">
        <Hero />
        {/* Additional sections can be added here */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-vicky-primary mb-6 font-outfit">Why Choose Beauty by Vicky's?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-vicky-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-vicky-accent">8+</span>
                </div>
                <h3 className="text-xl font-bold text-vicky-primary font-outfit">Years Experience</h3>
                <p className="text-vicky-primary/70 font-outfit">Professional makeup artistry dedicated to enhancing your natural beauty</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-vicky-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-vicky-accent">500+</span>
                </div>
                <h3 className="text-xl font-bold text-vicky-primary font-outfit">Happy Clients</h3>
                <p className="text-vicky-primary/70 font-outfit">Transforming faces and creating confidence for every special occasion</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-vicky-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-vicky-accent">5.0</span>
                </div>
                <h3 className="text-xl font-bold text-vicky-primary font-outfit">Client Rating</h3>
                <p className="text-vicky-primary/70 font-outfit">Consistently rated excellence in makeup artistry and customer service</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
