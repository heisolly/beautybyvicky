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
        
        {/* Why Choose Section */}
        <section className="section-scrollable bg-white">
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

        {/* Additional Services Preview Section */}
        <section className="section-scrollable bg-vicky-bg">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-vicky-primary mb-6 font-outfit">Our Services</h2>
            <p className="text-lg text-vicky-primary/70 mb-12 font-outfit max-w-2xl mx-auto">
              From bridal glamour to special events, we offer a range of makeup services tailored to your unique needs
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Bridal Makeup", price: "From ₦150,000" },
                { title: "Special Events", price: "From ₦75,000" },
                { title: "Photoshoot", price: "From ₦100,000" },
                { title: "Makeup Lessons", price: "From ₦50,000" }
              ].map((service, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-lg font-bold text-vicky-primary font-outfit mb-2">{service.title}</h3>
                  <p className="text-vicky-accent font-bold font-outfit">{service.price}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <a 
                href="/services" 
                className="inline-flex items-center space-x-2 bg-vicky-accent text-white px-8 py-3 rounded-2xl font-bold font-outfit hover:bg-vicky-primary transition-colors"
              >
                <span>View All Services</span>
              </a>
            </div>
          </div>
        </section>

        {/* Testimonial Preview Section */}
        <section className="section-scrollable bg-white">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-vicky-primary mb-6 font-outfit">What Our Clients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                { name: "Amara O.", text: "Vicky transformed my look for my wedding day. I felt absolutely beautiful!" },
                { name: "Chioma E.", text: "Professional, punctual, and incredibly talented. Highly recommend!" },
                { name: "Funke A.", text: "The makeup lessons were life-changing. I now feel confident doing my own makeup." }
              ].map((testimonial, index) => (
                <div key={index} className="bg-vicky-bg p-6 rounded-2xl">
                  <p className="text-vicky-primary/80 font-outfit mb-4 italic">"{testimonial.text}"</p>
                  <p className="text-vicky-accent font-bold font-outfit">- {testimonial.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-scrollable bg-vicky-accent text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 font-outfit">Ready to Transform Your Look?</h2>
            <p className="text-xl mb-8 font-outfit opacity-90">Book your appointment today and let us bring out your natural beauty</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/booking" 
                className="inline-flex items-center justify-center space-x-2 bg-white text-vicky-accent px-8 py-3 rounded-2xl font-bold font-outfit hover:bg-vicky-gold transition-colors"
              >
                <span>Book Now</span>
              </a>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center space-x-2 border-2 border-white text-white px-8 py-3 rounded-2xl font-bold font-outfit hover:bg-white hover:text-vicky-accent transition-colors"
              >
                <span>Contact Us</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
