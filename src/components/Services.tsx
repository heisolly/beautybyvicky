import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Crown, Star, Heart, ArrowRight } from 'lucide-react';
import { containerVariants, itemVariants } from '../utils/motion';

const Services: React.FC = () => {

  const services = [
    {
      icon: Crown,
      title: "Bridal Makeup",
      description: "Flawless, long-lasting makeup for your special day. Includes trial session and touch-up kit.",
      price: "From ₦150,000",
      features: ["Pre-wedding consultation", "Trial session", "Touch-up kit", "On-location service"]
    },
    {
      icon: Star,
      title: "Special Events",
      description: "Professional makeup for birthdays, anniversaries, and red carpet events.",
      price: "From ₦75,000",
      features: ["Custom look design", "False lashes", "Waterproof finish", "2-hour service"]
    },
    {
      icon: Heart,
      title: "Photoshoot Makeup",
      description: "Camera-ready makeup designed for professional photography and videography.",
      price: "From ₦100,000",
      features: ["HD makeup", "Contouring", "Color correction", "Multiple looks"]
    },
    {
      icon: Sparkles,
      title: "Makeup Lessons",
      description: "Personalized makeup tutorials to master your beauty routine.",
      price: "From ₦50,000",
      features: ["Product recommendations", "Technique training", "Personalized chart", "Take-home guide"]
    }
  ];

  return (
    <section className="section-full bg-vicky-bg p-0">
      {/* MOBILE VIEW (Preserved) */}
      <div className="md:hidden w-full flex flex-col justify-center items-center py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          {/* Header Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <motion.span variants={itemVariants} className="font-luxury text-4xl text-vicky-accent block mb-2">The Collection</motion.span>
            <motion.h2 
              variants={itemVariants}
              className="text-5xl font-bold text-vicky-primary font-outfit"
            >
              Our <span className="text-vicky-accent">Services</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="text-vicky-primary/60 max-w-lg mx-auto font-outfit">
              Tailored beauty experiences designed to highlight your unique features and elevate your natural glow.
            </motion.p>
          </motion.div>

          {/* Services Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 px-4"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glassmorphism p-8 flex flex-col items-center text-center space-y-6 group"
              >
                <div className="w-16 h-16 rounded-full bg-vicky-accent/10 flex items-center justify-center text-vicky-accent group-hover:bg-vicky-accent group-hover:text-white transition-all duration-500">
                  <span className="text-2xl font-bold font-outfit">{index + 1}</span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-vicky-primary font-outfit">{service.title}</h3>
                  <p className="text-vicky-accent font-bold text-xl font-outfit">{service.price}</p>
                </div>

                <p className="text-sm text-vicky-primary/70 leading-relaxed font-outfit">
                  {service.description}
                </p>

                <ul className="space-y-3 w-full text-left">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center space-x-3 text-xs text-vicky-primary/80 font-outfit">
                      <div className="w-1.5 h-1.5 rounded-full bg-vicky-gold" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/booking"
                  className="w-full btn-outline py-3 text-sm"
                >
                  Book Now
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Custom Package CTA */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <div className="inline-block p-10 glassmorphism max-w-2xl border-vicky-gold/20">
              <h3 className="text-3xl font-bold text-vicky-primary mb-4 font-outfit">Need a Custom Package?</h3>
              <p className="text-vicky-primary/70 mb-8 font-outfit">
                We offer personalized makeup solutions for bridal parties, corporate events, and editorial productions.
              </p>
              <Link to="/contact" className="btn-primary">
                Let's Talk
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* DESKTOP VIEW (Enhanced) */}
      <div className="hidden md:flex w-full min-h-screen items-center justify-center py-32 px-12 relative overflow-hidden">
        {/* Enhanced Background for Desktop */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F7] via-white to-[#FCE4EC]" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-vicky-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-vicky-gold/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-[1px] h-1/2 bg-vicky-gold/20 transform rotate-45" />
          <div className="absolute top-1/4 right-1/4 w-1/2 h-[1px] bg-vicky-gold/20 transform rotate-45" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-20 items-start">
            {/* Left Content: Sticky Header */}
            <div className="lg:w-1/3 lg:sticky lg:top-32 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="inline-block px-4 py-2 rounded-full bg-vicky-accent/10 border border-vicky-accent/20"
                >
                  <span className="text-sm font-bold tracking-widest text-vicky-accent uppercase font-outfit">Premium Services</span>
                </motion.div>
                
                <span className="font-luxury text-6xl text-vicky-accent block">The Art of</span>
                <h2 className="text-8xl font-bold text-vicky-primary font-outfit leading-tight">
                  Exquisite <br />
                  <span className="text-vicky-gold">Services</span>
                </h2>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl text-vicky-primary/60 font-outfit max-w-md leading-relaxed"
              >
                Experience the pinnacle of luxury makeup artistry. Our services are curated to provide a transformative journey, blending high-end products with masterful techniques.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="pt-8"
              >
                <Link to="/booking" className="btn-primary px-12 py-5 text-xl inline-block shadow-2xl hover:shadow-vicky-accent/20">
                  Book Your Transformation
                </Link>
              </motion.div>

              {/* Enhanced Decorative side element */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="hidden lg:block pt-12"
              >
                <div className="flex items-center space-x-4 opacity-30">
                  <div className="w-20 h-0.5 bg-vicky-primary" />
                  <span className="text-sm font-bold uppercase tracking-widest font-outfit">Lagos • Nigeria</span>
                  <div className="w-20 h-0.5 bg-vicky-primary" />
                </div>
              </motion.div>
            </div>

            {/* Right Content: Enhanced Services Grid */}
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-12">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className="group relative"
                >
                  <div className="absolute -inset-4 bg-vicky-accent/5 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                  
                  <div className="space-y-8 p-6 bg-white/40 backdrop-blur-sm rounded-[2rem] border border-vicky-border/20">
                    <div className="flex justify-between items-baseline">
                      <span className="text-5xl font-bold text-vicky-gold/20 font-outfit group-hover:text-vicky-accent/40 transition-colors">0{index + 1}</span>
                      <span className="text-3xl font-bold text-vicky-accent font-outfit">{service.price}</span>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-4xl font-bold text-vicky-primary font-outfit group-hover:text-vicky-accent transition-colors">{service.title}</h3>
                      <p className="text-lg text-vicky-primary/70 leading-relaxed font-outfit">
                        {service.description}
                      </p>
                    </div>

                    <div className="space-y-6">
                      <ul className="space-y-4">
                        {service.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-center space-x-4 text-sm font-bold text-vicky-primary/60 font-outfit uppercase tracking-wider">
                            <div className="w-2 h-2 rounded-full bg-vicky-gold" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Link to="/booking" className="inline-flex items-center space-x-3 text-vicky-accent font-bold font-outfit group/link pt-4">
                        <span className="border-b-2 border-vicky-accent/20 group-hover/link:border-vicky-accent transition-all pb-1">Reserve Session</span>
                        <ArrowRight className="w-5 h-5 group-hover/link:translate-x-2 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
