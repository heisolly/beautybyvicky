import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, MessageCircle, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-vicky-primary text-white py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <img src="/logo.png" alt="BeautybyVicky" className="h-16 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-white/60 font-outfit leading-relaxed">
              Elevating beauty through professional artistry. Based in the heart of Lagos, Nigeria.
            </p>
            <div className="flex space-x-4">
              {[Camera, MessageCircle].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-vicky-accent transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold font-outfit uppercase tracking-widest text-vicky-accent">Studio</h4>
            <nav className="flex flex-col space-y-4">
              {['Services', 'Gallery', 'Booking', 'FAQ'].map((item) => (
                <Link key={item} to={`/${item.toLowerCase()}`} className="text-white/70 hover:text-white transition-colors font-outfit">
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold font-outfit uppercase tracking-widest text-vicky-accent">Contact</h4>
            <div className="space-y-4 text-white/70 font-outfit">
              <p>Lagos, Nigeria</p>
              <p>+234 801 234 5678</p>
              <p>vicky@beautybyvicky.com</p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold font-outfit uppercase tracking-widest text-vicky-accent">Newsletter</h4>
            <div className="space-y-4">
              <p className="text-white/60 text-sm font-outfit">Get beauty tips and studio updates.</p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full bg-white/5 px-6 py-4 rounded-full border border-white/10 focus:border-vicky-accent outline-none font-outfit transition-all"
                />
                <button className="absolute right-2 top-2 bottom-2 px-4 bg-vicky-accent rounded-full hover:bg-vicky-accent/80 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-white/40 text-sm font-outfit">
          <p>© 2026 BeautybyVicky. All rights reserved.</p>
          <p className="font-luxury text-2xl text-vicky-accent/60">Artistry in every stroke</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
