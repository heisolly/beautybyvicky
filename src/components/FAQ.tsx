import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { containerVariants, itemVariants } from '../utils/motion';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How far in advance should I book my appointment?",
      answer: "We recommend booking at least 2-3 weeks in advance for regular services and 2-3 months for bridal makeup to ensure availability. However, we can sometimes accommodate last-minute requests, so feel free to reach out!"
    },
    {
      question: "Do you offer on-location services?",
      answer: "Yes! We offer on-location services for bridal makeup and special events within Lagos. Additional travel fees may apply for locations outside the mainland. Please contact us to discuss your specific location and requirements."
    },
    {
      question: "What is included in a bridal makeup package?",
      answer: "Our bridal package includes a pre-wedding consultation, trial session, wedding day makeup application, false lashes, touch-up kit, and on-location service. We also ensure communication throughout the process to achieve your desired look."
    },
    {
      question: "How long does each service take?",
      answer: "Service times vary: Bridal makeup takes 2-3 hours, special events 1.5-2 hours, photoshoot makeup 2-2.5 hours, and makeup lessons 1.5 hours. We always allocate enough time to ensure perfect results without rushing."
    },
    {
      question: "What makeup products do you use?",
      answer: "We use premium, professional-grade makeup products from brands like MAC, NARS, Fenty Beauty, and Dior. All products are cruelty-free and suitable for various skin types. We can accommodate specific product preferences or allergies."
    },
    {
      question: "Do you provide makeup for photoshoots?",
      answer: "Absolutely! We specialize in makeup designed specifically for photography and videography. Our HD makeup techniques ensure you look flawless on camera without flashback or oxidation."
    },
    {
      question: "What is your cancellation policy?",
      answer: "We require 48 hours' notice for cancellations to receive a full refund. Cancellations within 48 hours are subject to a 50% fee. No-shows will be charged the full amount. We understand emergencies and may make exceptions on a case-by-case basis."
    },
    {
      question: "Can you accommodate group bookings?",
      answer: "Yes! We offer group discounts for bridal parties, events, or special occasions. Please contact us with your group size and requirements for a customized quote and scheduling."
    },
    {
      question: "Do you offer makeup lessons?",
      answer: "Yes! Our makeup lessons are personalized to your skill level and goals. We cover everything from basic techniques to advanced application, product knowledge, and creating a personalized routine that works for you."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept bank transfers, cash, and major credit/debit cards. A 50% deposit is required to secure your booking, with the remaining balance due on the day of service."
    }
  ];

  return (
    <section className="section-full bg-vicky-bg p-0">
      {/* MOBILE VIEW (Preserved) */}
      <div className="md:hidden w-full flex flex-col justify-center items-center py-20 px-4 relative min-h-screen">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <motion.span variants={itemVariants} className="font-luxury text-4xl text-vicky-accent block mb-2">Curiosities</motion.span>
            <motion.h2 
              variants={itemVariants}
              className="text-5xl font-bold text-vicky-primary font-outfit"
            >
              Common <span className="text-vicky-accent">Questions</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="text-vicky-primary/60 max-w-lg mx-auto font-outfit">
              Everything you need to know about your transformation journey with us.
            </motion.p>
          </motion.div>

          {/* FAQ List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glassmorphism overflow-hidden transition-all duration-500 border-vicky-gold/10"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between group"
                >
                  <span className={`text-lg font-bold font-outfit transition-colors duration-300 ${
                    openIndex === index ? 'text-vicky-accent' : 'text-vicky-primary group-hover:text-vicky-accent'
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-full transition-transform duration-500 ${
                    openIndex === index ? 'bg-vicky-accent text-white rotate-180' : 'bg-vicky-accent/10 text-vicky-accent'
                  }`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <div className="px-8 pb-8 text-vicky-primary/70 leading-relaxed font-outfit">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          {/* Support CTA */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <div className="p-8 glassmorphism border-vicky-gold/20 inline-block max-w-lg">
              <HelpCircle className="w-12 h-12 text-vicky-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-vicky-primary mb-2 font-outfit">Still have questions?</h3>
              <p className="text-vicky-primary/70 mb-6 font-outfit">
                Our team is here to help you with any specific requirements or concerns.
              </p>
              <Link to="/contact" className="btn-primary">
                Contact Support
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* DESKTOP VIEW (Redesign) */}
      <div className="hidden md:flex w-full min-h-screen items-center justify-center py-32 px-12 relative overflow-hidden">
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex gap-24 items-start">
            {/* Left: Sticky Desktop Title */}
            <div className="w-2/5 sticky top-32 space-y-12">
              <div className="space-y-6">
                <span className="font-luxury text-7xl text-vicky-accent block">The Knowledge</span>
                <h2 className="text-9xl font-bold text-vicky-primary font-outfit leading-none tracking-tighter">
                  Frequent <br />
                  <span className="text-vicky-gold">Inquiries</span>
                </h2>
              </div>
              
              <p className="text-2xl text-vicky-primary/60 font-outfit leading-relaxed">
                Clarifying your path to beauty. We believe in transparency and professional guidance at every step.
              </p>

              <div className="pt-12">
                <div className="flex items-center space-x-6 group cursor-pointer">
                  <div className="w-20 h-20 rounded-full bg-vicky-accent flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
                    <HelpCircle className="w-10 h-10" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-vicky-primary/40 font-outfit">Direct Support</p>
                    <p className="text-2xl font-bold text-vicky-primary font-outfit border-b-2 border-vicky-gold/30">Ask us anything</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Desktop Accordion */}
            <div className="w-3/5 space-y-8">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className={`group border-b-2 transition-all duration-700 ${
                    openIndex === index ? 'border-vicky-accent py-12' : 'border-vicky-gold/10 py-8 hover:border-vicky-gold/40'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full text-left flex items-start justify-between"
                  >
                    <div className="flex gap-12 items-start">
                      <span className={`text-2xl font-bold font-outfit transition-colors duration-500 ${
                        openIndex === index ? 'text-vicky-accent' : 'text-vicky-primary/30'
                      }`}>
                        0{index + 1}
                      </span>
                      <h3 className={`text-4xl font-bold font-outfit transition-all duration-500 ${
                        openIndex === index ? 'text-vicky-accent translate-x-4' : 'text-vicky-primary group-hover:translate-x-2'
                      }`}>
                        {faq.question}
                      </h3>
                    </div>
                    <div className={`mt-2 transition-transform duration-700 ${
                      openIndex === index ? 'rotate-180 text-vicky-accent' : 'text-vicky-gold/40 group-hover:text-vicky-gold'
                    }`}>
                      <ChevronDown className="w-10 h-10" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, y: 20 }}
                        animate={{ height: 'auto', opacity: 1, y: 0 }}
                        exit={{ height: 0, opacity: 0, y: 10 }}
                        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="overflow-hidden"
                      >
                        <div className="pl-24 pt-8 text-2xl text-vicky-primary/60 leading-relaxed font-outfit max-w-2xl">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
