import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Camera, MessageCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const { showToast } = useToast();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = {
    email: 'matthewvic217@gmail.com',
    phones: ['+234 801 234 5678', '+234 901 234 5678'],
    location: 'Lagos, Nigeria',
    hours: 'Mon-Sat: 9AM-6PM, Sun: 10AM-4PM',
    instagram: '@beautybyvicky___',
    facebook: 'BeautyByVicky',
    twitter: '@beautybyvicky'
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^(\+234|0)?[789][01]\d{8}$/.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields'
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      showToast({
        type: 'error',
        title: 'Invalid Email',
        message: 'Please enter a valid email address'
      });
      return;
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      showToast({
        type: 'error',
        title: 'Invalid Phone',
        message: 'Please enter a valid Nigerian phone number'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save to Supabase database
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject || null,
          message: formData.message,
          status: 'new'
        })
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      showToast({
        type: 'success',
        title: 'Message Sent Successfully!',
        message: `Thank you ${formData.name}! We'll get back to you soon. Reference: ${data[0].id}`
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Contact submission error:', error);
      showToast({
        type: 'error',
        title: 'Submission Failed',
        message: 'There was an error sending your message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-full bg-vicky-bg p-0">
      {/* MOBILE VIEW (Preserved) */}
      <div className="md:hidden w-full flex flex-col justify-center items-center py-20 px-4 relative min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <motion.span variants={itemVariants} className="font-luxury text-4xl text-vicky-accent block mb-2">Get in Touch</motion.span>
            <motion.h2 
              variants={itemVariants}
              className="text-5xl font-bold text-vicky-primary font-outfit"
            >
              Connect with <span className="text-vicky-accent">Vicky</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="text-vicky-primary/60 max-w-lg mx-auto font-outfit">
              Ready to start your beauty transformation? Reach out for bookings, collaborations, or inquiries.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 gap-12 items-start max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glassmorphism p-8 order-2"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-vicky-primary/60 uppercase tracking-widest font-outfit ml-4">Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-6 py-4 rounded-full bg-white/50 border border-vicky-border focus:border-vicky-accent outline-none transition-all font-outfit"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-vicky-primary/60 uppercase tracking-widest font-outfit ml-4">Email</label>
                    <input
                      type="email"
                      required
                      className="w-full px-6 py-4 rounded-full bg-white/50 border border-vicky-border focus:border-vicky-accent outline-none transition-all font-outfit"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-vicky-primary/60 uppercase tracking-widest font-outfit ml-4">Subject</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 rounded-full bg-white/50 border border-vicky-border focus:border-vicky-accent outline-none transition-all font-outfit"
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-vicky-primary/60 uppercase tracking-widest font-outfit ml-4">Message</label>
                  <textarea
                    rows={4}
                    required
                    className="w-full px-6 py-4 rounded-[2rem] bg-white/50 border border-vicky-border focus:border-vicky-accent outline-none transition-all font-outfit resize-none"
                    placeholder="Tell us everything..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-5 text-lg group disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>

            {/* Contact Info & Socials */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-12 order-1"
            >
              <div className="space-y-8">
                <h3 className="text-3xl font-bold text-vicky-primary font-outfit">Contact Details</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-6 group">
                    <div className="w-14 h-14 rounded-full bg-vicky-accent/10 flex items-center justify-center text-vicky-accent group-hover:bg-vicky-accent group-hover:text-white transition-all duration-300">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-vicky-primary/40 uppercase tracking-widest font-outfit">Email Us</p>
                      <p className="text-xl font-bold text-vicky-primary font-outfit">{contactInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 group">
                    <div className="w-14 h-14 rounded-full bg-vicky-accent/10 flex items-center justify-center text-vicky-accent group-hover:bg-vicky-accent group-hover:text-white transition-all duration-300">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-vicky-primary/40 uppercase tracking-widest font-outfit">Call Us</p>
                      <p className="text-xl font-bold text-vicky-primary font-outfit">{contactInfo.phones[0]}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 group">
                    <div className="w-14 h-14 rounded-full bg-vicky-accent/10 flex items-center justify-center text-vicky-accent group-hover:bg-vicky-accent group-hover:text-white transition-all duration-300">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-vicky-primary/40 uppercase tracking-widest font-outfit">Studio Location</p>
                      <p className="text-xl font-bold text-vicky-primary font-outfit">{contactInfo.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-vicky-primary font-outfit">Follow the Journey</h3>
                <div className="flex space-x-4">
                  {[
                    { icon: MessageCircle, label: 'WhatsApp', href: `https://wa.me/${contactInfo.phones[0].replace(/\s/g, '')}` },
                    { icon: Camera, label: 'Instagram', href: `https://instagram.com/${contactInfo.instagram.replace('@', '')}` }
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center space-x-3 py-4 glassmorphism hover:bg-vicky-accent hover:text-white transition-all duration-300 group"
                    >
                      <social.icon className="w-5 h-5" />
                      <span className="font-bold text-sm font-outfit">{social.label}</span>
                    </a>
                  ))}
                </div>
                <p className="text-center font-luxury text-3xl text-vicky-accent pt-4 rotate-2 italic">Beauty by Vicky</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW (Redesign) */}
      <div className="hidden md:flex w-full min-h-screen items-center justify-center py-32 px-12 relative overflow-hidden">
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-12 gap-24">
            {/* Left: Immersive Contact Content */}
            <div className="col-span-5 space-y-16">
              <div className="space-y-8">
                <span className="font-luxury text-7xl text-vicky-accent block">Contact Us</span>
                <h2 className="text-9xl font-bold text-vicky-primary font-outfit leading-[0.8] tracking-tighter">
                  Let's <br />
                  <span className="text-vicky-gold">Create</span>
                </h2>
                <p className="text-2xl text-vicky-primary/60 font-outfit leading-relaxed max-w-md pt-8 border-t border-vicky-gold/20">
                  Ready to experience artistry like never before? Our studio doors are open for your transformation.
                </p>
              </div>

              <div className="space-y-12">
                <div className="grid grid-cols-1 gap-10">
                  <div className="group flex items-center space-x-8">
                    <div className="w-24 h-24 rounded-[2rem] bg-white shadow-2xl flex items-center justify-center text-vicky-accent group-hover:bg-vicky-accent group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                      <Mail className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-vicky-primary/40 font-outfit">Electronic Mail</p>
                      <p className="text-3xl font-bold text-vicky-primary font-outfit">{contactInfo.email}</p>
                    </div>
                  </div>

                  <div className="group flex items-center space-x-8">
                    <div className="w-24 h-24 rounded-[2rem] bg-white shadow-2xl flex items-center justify-center text-vicky-accent group-hover:bg-vicky-accent group-hover:text-white transition-all duration-500 transform group-hover:-rotate-6">
                      <Phone className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-vicky-primary/40 font-outfit">Voice Call</p>
                      <p className="text-3xl font-bold text-vicky-primary font-outfit">{contactInfo.phones[0]}</p>
                    </div>
                  </div>

                  <div className="group flex items-center space-x-8">
                    <div className="w-24 h-24 rounded-[2rem] bg-white shadow-2xl flex items-center justify-center text-vicky-accent group-hover:bg-vicky-accent group-hover:text-white transition-all duration-500 transform group-hover:rotate-12">
                      <MapPin className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-vicky-primary/40 font-outfit">Studio Base</p>
                      <p className="text-3xl font-bold text-vicky-primary font-outfit">{contactInfo.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Sophisticated Desktop Form */}
            <div className="col-span-7 relative">
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="bg-white p-20 rounded-[4rem] shadow-[0_80px_150px_-30px_rgba(45,27,34,0.15)] relative overflow-hidden"
              >
                {/* Background decorative script */}
                <span className="absolute -top-10 -right-10 text-[12rem] font-luxury text-vicky-accent/5 pointer-events-none -rotate-12">Vicky</span>
                
                <form onSubmit={handleSubmit} className="relative z-10 space-y-12">
                  <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <label className="text-sm font-bold uppercase tracking-[0.2em] text-vicky-primary/40 font-outfit ml-2">Full Name</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-transparent border-b-2 border-vicky-gold/20 focus:border-vicky-accent py-4 text-2xl font-outfit outline-none transition-colors"
                        placeholder="Grace Kelly"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-sm font-bold uppercase tracking-[0.2em] text-vicky-primary/40 font-outfit ml-2">Email Address</label>
                      <input
                        type="email"
                        required
                        className="w-full bg-transparent border-b-2 border-vicky-gold/20 focus:border-vicky-accent py-4 text-2xl font-outfit outline-none transition-colors"
                        placeholder="grace@luxury.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-[0.2em] text-vicky-primary/40 font-outfit ml-2">Inquiry Subject</label>
                    <input
                      type="text"
                      className="w-full bg-transparent border-b-2 border-vicky-gold/20 focus:border-vicky-accent py-4 text-2xl font-outfit outline-none transition-colors"
                      placeholder="Bridal / Editorial / Event"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-[0.2em] text-vicky-primary/40 font-outfit ml-2">Detailed Message</label>
                    <textarea
                      rows={4}
                      required
                      className="w-full bg-transparent border-b-2 border-vicky-gold/20 focus:border-vicky-accent py-4 text-2xl font-outfit outline-none transition-colors resize-none"
                      placeholder="Share your vision with us..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  <div className="pt-8">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full py-8 text-2xl flex items-center justify-center space-x-6 group disabled:opacity-50"
                    >
                      <span className="font-outfit">{isSubmitting ? 'Sending Vision...' : 'Initiate Contact'}</span>
                      {!isSubmitting && <ArrowRight className="w-8 h-8 group-hover:translate-x-4 transition-transform" />}
                    </button>
                  </div>
                </form>
              </motion.div>

              {/* Floating decorative element */}
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-vicky-gold/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
