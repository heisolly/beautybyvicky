import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Star, Heart, Sparkles, Crown, Check, Calendar, Phone, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEO from './SEO';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  image_url?: string;
  features: string[];
  is_popular: boolean;
}

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setService(data);
    } catch (error) {
      console.error('Error fetching service:', error);
      setError('Service not found');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'bridal':
        return Crown;
      case 'events':
        return Star;
      case 'photoshoot':
        return Heart;
      case 'lessons':
        return Sparkles;
      default:
        return Star;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-vicky-bg flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-vicky-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-vicky-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-vicky-primary mb-4">Service Not Found</h2>
          <Link to="/services" className="btn-primary">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const Icon = getServiceIcon(service.category);

  return (
    <>
      <SEO 
        title={`${service.name} - Beauty by Vicky`}
        description={service.description}
        keywords={`${service.name}, makeup services Lagos, professional makeup, ${service.category}`}
        ogUrl={`/services/${id}`}
      />
      
      <div className="min-h-screen bg-vicky-bg">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-[#FFF5F7] via-white to-[#FCE4EC] py-20 px-6">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-20 w-64 h-64 bg-vicky-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-vicky-gold/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <Link 
                to="/services" 
                className="inline-flex items-center space-x-2 text-vicky-primary hover:text-vicky-accent transition-colors mb-8"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-outfit">Back to Services</span>
              </Link>

              <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* Service Icon and Basic Info */}
                <div className="lg:w-1/3">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-center lg:text-left"
                  >
                    <div className="w-24 h-24 rounded-full bg-vicky-accent/10 flex items-center justify-center text-vicky-accent mx-auto lg:mx-0 mb-6">
                      <Icon className="w-12 h-12" />
                    </div>

                    <h1 className="text-5xl font-bold text-vicky-primary font-outfit mb-4">
                      {service.name}
                    </h1>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-center lg:justify-start space-x-3">
                        <span className="text-4xl font-bold text-vicky-accent font-outfit">
                          {formatPrice(service.price)}
                        </span>
                      </div>

                      {service.is_popular && (
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-vicky-gold/20 text-vicky-gold rounded-full">
                          <Star className="w-5 h-5 fill-current" />
                          <span className="font-bold font-outfit">Popular Service</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-center lg:justify-start space-x-6 text-vicky-primary/60">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5" />
                        <span className="font-outfit">{service.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-outfit capitalize">{service.category}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Service Details */}
                <div className="lg:w-2/3">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-3xl font-bold text-vicky-primary font-outfit mb-4">About This Service</h2>
                      <p className="text-xl text-vicky-primary/70 leading-relaxed font-outfit">
                        {service.description}
                      </p>
                    </div>

                    {service.features.length > 0 && (
                      <div>
                        <h3 className="text-2xl font-bold text-vicky-primary font-outfit mb-6">What's Included</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {service.features.map((feature, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                              className="flex items-center space-x-3"
                            >
                              <div className="w-6 h-6 rounded-full bg-vicky-gold flex items-center justify-center flex-shrink-0">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-vicky-primary/80 font-outfit">{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-8">
                      <Link
                        to="/booking"
                        state={{ selectedService: service }}
                        className="inline-flex items-center space-x-3 bg-vicky-primary text-white px-8 py-4 rounded-full font-bold font-outfit hover:bg-vicky-accent transition-all shadow-2xl hover:shadow-vicky-accent/20"
                      >
                        <Calendar className="w-5 h-5" />
                        <span>Book This Service</span>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="py-20 px-6">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h3 className="text-3xl font-bold text-vicky-primary font-outfit mb-6">Have Questions?</h3>
              <p className="text-xl text-vicky-primary/70 mb-8 font-outfit">
                Our team is here to help you choose the perfect service for your needs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link 
                  to="/contact" 
                  className="flex items-center space-x-3 btn-outline"
                >
                  <Mail className="w-5 h-5" />
                  <span>Contact Us</span>
                </Link>
                
                <a 
                  href="tel:+2348012345678" 
                  className="flex items-center space-x-3 btn-primary"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Us</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetail;
