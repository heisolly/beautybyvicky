import React from 'react';
import Gallery from '../components/Gallery';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const GalleryPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="Gallery - Beauty by Vicky's"
        description="Explore our portfolio of stunning makeup transformations. From bridal elegance to glamour looks, see our artistry in action."
        keywords="makeup gallery, bridal makeup portfolio, glamour makeup photos, makeup artist portfolio"
        ogUrl="/gallery"
      />
      <div className="min-h-screen">
        <Gallery />
        {/* Additional sections can be added here */}
        <section className="py-20 px-4 bg-vicky-bg">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-vicky-primary mb-6 font-outfit">Ready for Your Transformation?</h2>
            <p className="text-lg text-vicky-primary/70 mb-8 font-outfit max-w-2xl mx-auto">
              Join our satisfied clients who have experienced the Beauty by Vicky's difference. 
              Every look is customized to highlight your unique beauty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/booking"
                className="bg-vicky-accent text-white px-8 py-4 rounded-full font-bold font-outfit hover:bg-vicky-primary transition-all shadow-lg"
              >
                Book Your Session
              </Link>
              <Link
                to="/contact"
                className="border-2 border-vicky-accent text-vicky-accent px-8 py-4 rounded-full font-bold font-outfit hover:bg-vicky-accent hover:text-white transition-all"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default GalleryPage;
