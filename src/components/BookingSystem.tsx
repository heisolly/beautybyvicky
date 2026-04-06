import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { containerVariants, itemVariants } from '../utils/motion';
import { useToast } from '../contexts/ToastContext';

interface BookingData {
  service: {
    id: string;
    name: string;
    price: string;
    duration: number;
  } | null;
  date: string;
  time: string;
  clientInfo: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
}

const BookingSystem: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    service: null,
    date: '',
    time: '',
    clientInfo: {
      name: '',
      email: '',
      phone: '',
      notes: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const services = [
    { id: 'bridal', name: 'Bridal Makeup', price: '₦150,000', duration: 180 },
    { id: 'events', name: 'Special Events', price: '₦75,000', duration: 120 },
    { id: 'photoshoot', name: 'Photoshoot Makeup', price: '₦100,000', duration: 150 },
    { id: 'lessons', name: 'Makeup Lessons', price: '₦50,000', duration: 90 },
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  // Generate available dates (next 14 days)
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const availableDates = generateDates();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^(\+234|0)?[789][01]\d{8}$/.test(phone.replace(/\s/g, ''));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData.clientInfo.name || !bookingData.clientInfo.email) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields'
      });
      return;
    }

    if (!validateEmail(bookingData.clientInfo.email)) {
      showToast({
        type: 'error',
        title: 'Invalid Email',
        message: 'Please enter a valid email address'
      });
      return;
    }

    if (bookingData.clientInfo.phone && !validatePhone(bookingData.clientInfo.phone)) {
      showToast({
        type: 'error',
        title: 'Invalid Phone',
        message: 'Please enter a valid Nigerian phone number'
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate booking submission
    setTimeout(() => {
      showToast({
        type: 'success',
        title: 'Booking Confirmed!',
        message: 'Your appointment has been successfully booked.'
      });
      setIsSubmitting(false);
      // Reset form
      setCurrentStep(1);
      setBookingData({
        service: null,
        date: '',
        time: '',
        clientInfo: {
          name: '',
          email: '',
          phone: '',
          notes: ''
        }
      });
    }, 2000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>Select Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setBookingData({ ...bookingData, service })}
                  className={`p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    bookingData.service?.id === service.id
                      ? 'border-vicky-accent bg-vicky-accent/5 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2 sm:mb-3">
                    <h4 className="font-semibold text-gray-900 text-base sm:text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {service.name}
                    </h4>
                    <span className="text-base sm:text-xl font-bold text-vicky-accent" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {service.price}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {Math.floor(service.duration / 60)}h {service.duration % 60}m duration
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>Select Date</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
              {availableDates.map((date, index) => {
                const dateStr = date.toISOString().split('T')[0];
                const isToday = index === 0;
                return (
                  <div
                    key={index}
                    onClick={() => setBookingData({ ...bookingData, date: dateStr })}
                    className={`p-2 sm:p-4 border-2 rounded-xl cursor-pointer text-center transition-all ${
                      bookingData.date === dateStr
                        ? 'border-vicky-accent bg-vicky-accent/5 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    {isToday && (
                      <span className="text-xs text-vicky-accent font-semibold block mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        TODAY
                      </span>
                    )}
                    <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                    </p>
                    <p className="text-base sm:text-xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {date.getDate()}
                    </p>
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>Select Time</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {timeSlots.map((time) => (
                <div
                  key={time}
                  onClick={() => setBookingData({ ...bookingData, time })}
                  className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer text-center transition-all ${
                    bookingData.time === time
                      ? 'border-vicky-accent bg-vicky-accent/5 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <p className="font-semibold text-gray-900 text-sm sm:text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>Your Information</h3>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  value={bookingData.clientInfo.name}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    clientInfo: { ...bookingData.clientInfo, name: e.target.value }
                  })}
                  className="w-full px-3 sm:px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none transition-all"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Your Email
                </label>
                <input
                  type="email"
                  value={bookingData.clientInfo.email}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    clientInfo: { ...bookingData.clientInfo, email: e.target.value }
                  })}
                  className="w-full px-3 sm:px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none transition-all"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Your Phone
                </label>
                <input
                  type="tel"
                  value={bookingData.clientInfo.phone}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    clientInfo: { ...bookingData.clientInfo, phone: e.target.value }
                  })}
                  className="w-full px-3 sm:px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none transition-all"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                  placeholder="08012345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Special Notes
                </label>
                <textarea
                  value={bookingData.clientInfo.notes}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    clientInfo: { ...bookingData.clientInfo, notes: e.target.value }
                  })}
                  className="w-full px-3 sm:px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none transition-all resize-none"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                  rows={3}
                  placeholder="Any special requests or notes..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 sm:py-4 px-6 rounded-xl font-semibold text-base sm:text-lg transition-all`}
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Booking...
                  </span>
                ) : (
                  'Complete Booking'
                )}
              </button>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="section-full bg-vicky-bg p-0">
      {/* MOBILE VIEW (Preserved) */}
      <div className="md:hidden w-full flex flex-col justify-center items-center py-20 px-4 relative">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12 space-y-4"
          >
            <motion.span variants={itemVariants} className="font-luxury text-4xl text-vicky-accent block mb-2">Reservations</motion.span>
            <motion.h2 
              variants={itemVariants}
              className="text-5xl font-bold text-vicky-primary font-outfit"
            >
              Book Your <span className="text-vicky-accent">Glow</span>
            </motion.h2>
            
            {/* Progress Bar */}
            <div className="flex justify-center items-center space-x-4 pt-8">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-outfit transition-all duration-500 ${
                    currentStep >= step ? 'bg-vicky-accent text-white shadow-lg' : 'bg-vicky-accent/10 text-vicky-accent'
                  }`}>
                    {currentStep > step ? <Check className="w-5 h-5" /> : step}
                  </div>
                  {step < 4 && (
                    <div className={`w-8 h-1 mx-2 rounded-full transition-all duration-500 ${
                      currentStep > step ? 'bg-vicky-accent' : 'bg-vicky-accent/10'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Booking Form Content */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="glassmorphism p-8 min-h-[500px] flex flex-col"
          >
            <div className="flex-1">
              {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-vicky-border">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1 || isSubmitting}
                className={`flex items-center space-x-2 font-bold font-outfit transition-all ${
                  currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-vicky-primary hover:text-vicky-accent'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back</span>
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !bookingData.service) ||
                    (currentStep === 2 && !bookingData.date) ||
                    (currentStep === 3 && !bookingData.time)
                  }
                  className="btn-primary py-3 px-10 disabled:opacity-50 disabled:translate-y-0"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-outfit">Next Step</span>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-primary py-4 px-12 group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-outfit text-lg">{isSubmitting ? 'Confirming...' : 'Confirm Booking'}</span>
                    {!isSubmitting && <Check className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                  </div>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* DESKTOP VIEW (Redesign) */}
      <div className="hidden md:flex w-full min-h-screen items-center justify-center py-32 px-12 relative overflow-hidden">
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-12 gap-24 items-start">
            {/* Left: Desktop Booking Sidebar */}
            <div className="col-span-4 space-y-12">
              <div className="space-y-6">
                <span className="font-luxury text-7xl text-vicky-accent block">Reservations</span>
                <h2 className="text-9xl font-bold text-vicky-primary font-outfit leading-[0.8] tracking-tighter">
                  Secure <br />
                  <span className="text-vicky-gold">Beauty</span>
                </h2>
              </div>
              
              <div className="space-y-8">
                <p className="text-2xl text-vicky-primary/60 font-outfit leading-relaxed">
                  Your journey to radiance begins here. Select your desired service and preferred timing for a personalized beauty session.
                </p>

                {/* Desktop Step Indicators */}
                <div className="space-y-6 pt-8 border-t border-vicky-gold/20">
                  {[
                    { step: 1, label: 'Choose Service' },
                    { step: 2, label: 'Select Date' },
                    { step: 3, label: 'Pick Time' },
                    { step: 4, label: 'Finalize' }
                  ].map((item) => (
                    <div key={item.step} className="flex items-center space-x-6 group">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold font-outfit transition-all duration-500 ${
                        currentStep === item.step 
                          ? 'bg-vicky-accent text-white scale-125 shadow-xl' 
                          : currentStep > item.step 
                            ? 'bg-vicky-gold text-white' 
                            : 'bg-vicky-accent/5 text-vicky-accent/40'
                      }`}>
                        {currentStep > item.step ? <Check className="w-6 h-6" /> : item.step}
                      </div>
                      <span className={`text-xl font-bold font-outfit transition-colors duration-500 ${
                        currentStep === item.step ? 'text-vicky-primary' : 'text-vicky-primary/30'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Immersive Desktop Booking Form */}
            <div className="col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="bg-white p-20 rounded-[4rem] shadow-[0_80px_150px_-30px_rgba(45,27,34,0.15)] min-h-[700px] flex flex-col relative overflow-hidden"
              >
                <div className="flex-1">
                  {renderStep()}
                </div>

                {/* Desktop Navigation */}
                <div className="flex justify-between items-center mt-16 pt-12 border-t border-vicky-gold/10">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 1 || isSubmitting}
                    className={`flex items-center space-x-4 text-xl font-bold font-outfit transition-all ${
                      currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-vicky-primary/40 hover:text-vicky-accent'
                    }`}
                  >
                    <ChevronLeft className="w-8 h-8" />
                    <span>Go Back</span>
                  </button>

                  <div className="flex items-center space-x-8">
                    {currentStep < 4 ? (
                      <button
                        onClick={handleNext}
                        disabled={
                          (currentStep === 1 && !bookingData.service) ||
                          (currentStep === 2 && !bookingData.date) ||
                          (currentStep === 3 && !bookingData.time)
                        }
                        className="btn-primary px-16 py-6 text-2xl flex items-center space-x-6 disabled:opacity-30 disabled:translate-y-0"
                      >
                        <span className="font-outfit">Continue</span>
                        <ChevronRight className="w-8 h-8" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="btn-primary px-20 py-8 text-3xl flex items-center space-x-8 group"
                      >
                        <span className="font-outfit">{isSubmitting ? 'Confirming...' : 'Finalize Booking'}</span>
                        {!isSubmitting && <Check className="w-10 h-10 group-hover:scale-125 transition-transform" />}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSystem;
