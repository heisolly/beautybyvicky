import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* MOBILE VIEW (Preserved) */}
      <div className="md:hidden w-full min-h-screen flex flex-col items-center justify-center px-4 py-20 relative">
        {/* Background with softer, more premium pinks */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#FFF5F7,transparent),radial-gradient(circle_at_bottom_left,#FCE4EC,transparent)] bg-vicky-bg" />
        
        {/* Floating handwriting elements for mobile flair */}
        <div className="absolute top-20 left-10 opacity-20 pointer-events-none">
          <span className="text-6xl font-luxury text-vicky-accent -rotate-12 block">Beauty</span>
        </div>
        <div className="absolute bottom-40 right-10 opacity-20 pointer-events-none">
          <span className="text-6xl font-handwriting text-vicky-soft rotate-12 block">Artistry</span>
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center space-y-8"
          >
            {/* Main Title with Outfit and Luxury Font */}
            <div className="space-y-4">
              <motion.div variants={itemVariants} className="inline-block px-4 py-1 rounded-full bg-vicky-accent/10 border border-vicky-accent/20">
                <span className="text-xs font-bold tracking-widest text-vicky-accent uppercase font-outfit">Luxury Makeup Studio</span>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-5xl sm:text-7xl font-bold text-vicky-primary leading-[0.9] font-outfit"
              >
                Pushing <br />
                <span className="text-vicky-accent font-luxury italic normal-case block">Artistry</span>
                <br />
                <span className="relative">
                  Boundaries
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute -bottom-2 left-0 h-1 bg-vicky-gold/40 rounded-full" 
                  />
                </span>
              </motion.h1>
            </div>

            {/* Image Container */}
            <motion.div
              variants={itemVariants}
              className="relative w-full max-w-[280px] sm:max-w-md aspect-[4/5]"
            >
              <div className="absolute inset-0 bg-vicky-gold/10 rounded-[3rem] rotate-6 transform" />
              <div className="absolute inset-0 bg-vicky-accent/5 rounded-[3rem] -rotate-3 transform" />
              <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white">
                <img
                  src="/hero-model.png"
                  alt="Luxury Makeup"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vicky-primary/40 to-transparent" />
              </div>
            </motion.div>

            {/* Description and CTA */}
            <div className="max-w-2xl space-y-2 px-4">
              <motion.p variants={itemVariants} className="text-lg text-vicky-primary/70 leading-relaxed font-outfit">
                Discover the transformative power of professional makeup artistry with <span className="font-handwriting text-2xl text-vicky-accent">Beauty by Vicky's</span>. 
                Elevating natural beauty in Lagos.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/booking"
                  className="bg-vicky-primary text-white px-12 py-5 rounded-full font-bold flex items-center justify-center space-x-3 w-full sm:w-auto group shadow-2xl hover:bg-vicky-accent transition-all"
                >
                  <span className="font-outfit">Book Your Session</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/gallery"
                  className="border-2 border-vicky-accent text-vicky-accent px-12 py-5 rounded-full font-bold w-full sm:w-auto flex justify-center hover:bg-vicky-accent hover:text-white transition-all"
                >
                  <span className="font-outfit">View Portfolio</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Trust Badge for Mobile */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-0 right-0 flex justify-center"
        >
          <div className="flex items-center space-x-6 px-6 py-3 glassmorphism">
            <div className="text-center border-r border-vicky-border pr-6">
              <p className="text-lg font-bold text-vicky-accent">5.0</p>
              <p className="text-[8px] uppercase tracking-widest text-vicky-primary/50">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-vicky-accent">8yr+</p>
              <p className="text-[8px] uppercase tracking-widest text-vicky-primary/50">Experience</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* DESKTOP VIEW (Enhanced) */}
      <div className="hidden md:flex w-full min-h-screen relative bg-gradient-to-br from-[#FFF5F7] via-white to-[#FCE4EC]">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-vicky-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-vicky-gold/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-[1px] h-1/2 bg-vicky-gold/20 transform rotate-45" />
        </div>

        <div className="container mx-auto grid grid-cols-2 gap-12 items-center relative z-10 px-12 py-20">
          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-block px-4 py-2 rounded-full bg-vicky-accent/10 border border-vicky-accent/20"
              >
                <span className="text-sm font-bold tracking-widest text-vicky-accent uppercase font-outfit">Luxury Makeup Studio</span>
              </motion.div>
              
              <h1 className="text-7xl lg:text-8xl font-bold text-vicky-primary leading-[1.1] font-outfit">
                Pushing the <br />
                <span className="text-vicky-accent">Boundary</span> <br />
                of Artistry
              </h1>
            </div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg text-vicky-primary/80 leading-relaxed font-outfit max-w-lg"
            >
              Experience the pinnacle of professional makeup artistry in Lagos. Our expert artists specialize in creating stunning, personalized looks that enhance your natural beauty and leave you feeling confident for any occasion.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex items-center space-x-6"
            >
              <Link
                to="/booking"
                className="bg-vicky-primary text-white px-8 py-4 rounded-full text-lg font-bold flex items-center space-x-3 w-fit group shadow-lg hover:bg-vicky-accent transition-all"
              >
                <span className="font-outfit">Book an Appointment</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <div className="flex items-center space-x-4 text-vicky-primary/60">
                <div className="text-center">
                  <p className="text-2xl font-bold text-vicky-accent">5.0</p>
                  <p className="text-xs uppercase tracking-wider">Rating</p>
                </div>
                <div className="w-px h-8 bg-vicky-primary/20" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-vicky-accent">8yr+</p>
                  <p className="text-xs uppercase tracking-wider">Experience</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Enhanced Image Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="relative flex justify-center items-center"
          >
            {/* Decorative background shapes */}
            <div className="absolute inset-0 w-full h-full max-w-lg max-h-[600px]">
              <svg 
                viewBox="0 0 400 600" 
                className="w-full h-full"
                style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))' }}
              >
                <path 
                  d="M 50 100 Q 30 200 60 300 T 40 450 Q 60 520 120 540 T 250 550 Q 320 540 350 480 T 360 350 Q 370 250 340 150 T 280 80 Q 200 60 120 80 T 50 100" 
                  fill="#FCE4EC" 
                  stroke="none"
                />
              </svg>
            </div>
            
            {/* Floating decorative elements */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-10 -right-10 w-20 h-20 bg-vicky-gold/20 rounded-full blur-lg"
            />
            <motion.div
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-10 -left-10 w-16 h-16 bg-vicky-accent/20 rounded-full blur-lg"
            />
            
            {/* Main Image Container */}
            <div className="relative w-4/5 aspect-[3/4] z-10">
              <div className="absolute inset-0 bg-vicky-gold/10 rounded-[3rem] rotate-6 transform" />
              <div className="absolute inset-0 bg-vicky-accent/5 rounded-[3rem] -rotate-3 transform" />
              <div className="relative h-full w-full overflow-hidden rounded-[2rem] shadow-2xl border-4 border-white">
                <img
                  src="/hero-model.png"
                  alt="Luxury Makeup Artistry"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vicky-primary/20 to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
