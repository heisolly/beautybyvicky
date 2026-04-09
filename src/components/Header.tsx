import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 py-4 ${
        isScrolled ? 'md:py-4' : 'md:py-8'
      }`}
    >
      <div className={`max-w-7xl mx-auto transition-all duration-500 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-2 px-6 rounded-2xl' : 'bg-transparent py-2 px-4'
      }`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="relative group flex items-center">
            <img src="/logo.png" alt="Beauty by Vicky" className="h-10 md:h-14 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:text-vicky-accent relative group ${
                  location.pathname === link.path ? 'text-vicky-accent' : 'text-vicky-primary/70'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-vicky-accent transition-all duration-300 ${
                  location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}
            <Link
              to="/booking"
              className="bg-vicky-primary text-white py-2.5 px-6 text-xs uppercase tracking-widest sharp-button hover:bg-vicky-accent transition-all duration-300"
            >
              Book Now
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-vicky-primary hover:text-vicky-accent transition-colors bg-white/20 backdrop-blur-sm rounded-xl"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 md:hidden flex flex-col bg-vicky-bg/95 backdrop-blur-xl p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-2xl font-bold text-vicky-primary">Beauty<span className="text-vicky-accent">by</span>Vicky</span>
              <button onClick={closeMobileMenu} className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <X className="w-6 h-6 text-vicky-primary" />
              </button>
            </div>

            <nav className="flex flex-col space-y-6 flex-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`text-4xl font-bold ${
                      location.pathname === link.path ? 'text-vicky-accent' : 'text-vicky-primary'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto space-y-6">
              <Link
                to="/booking"
                className="bg-vicky-primary text-white w-full text-center text-lg py-5 sharp-button block"
                onClick={closeMobileMenu}
              >
                Book Appointment
              </Link>
              <div className="flex justify-center space-x-6">
                <span className="text-3xl text-vicky-accent">Artistry in Lagos</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
