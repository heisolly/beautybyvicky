import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  image_url: string;
  likes?: number;
  is_featured?: boolean;
  sort_order?: number;
}

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Work' },
    { id: 'bridal', name: 'Bridal' },
    { id: 'glamour', name: 'Glamour' },
    { id: 'natural', name: 'Natural' },
    { id: 'editorial', name: 'Editorial' },
    { id: 'photoshoot', name: 'Photoshoot' },
    { id: 'special-occasions', name: 'Special Occasions' },
    { id: 'behind-the-scenes', name: 'Behind the Scenes' }
  ];

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPortfolioItems(data || []);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      // Fallback to hardcoded images if there's an error
      setPortfolioItems([
        { id: '1', title: 'Bridal Elegance', image_url: '/hero-model.png', category: 'bridal' },
        { id: '2', title: 'Glamour Night', image_url: '/hero.jpg', category: 'glamour' },
        { id: '3', title: 'Natural Beauty', image_url: '/collection-beauty-products-with-copy-space.jpg', category: 'natural' },
        { id: '4', title: 'Behind the Scenes', image_url: '/closeup-shot-professional-makeup-brushes-tools.jpg', category: 'behind-the-scenes' },
        { id: '5', title: 'Editorial Bold', image_url: '/hero-model.png', category: 'editorial' },
        { id: '6', title: 'Photoshoot Ready', image_url: '/hero.jpg', category: 'photoshoot' }
      ]);
    }
  };

  const filteredItems = activeCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <section className="min-h-screen bg-[#FFF5F7]">
      {/* MOBILE VIEW (Preserved) */}
      <div className="md:hidden w-full flex flex-col justify-center items-center py-20 px-4 relative">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <span className="font-luxury text-4xl text-vicky-accent block mb-2">The Lookbook</span>
            <h2 className="text-5xl font-bold text-vicky-primary font-outfit">
              Our <span className="text-vicky-accent">Gallery</span>
            </h2>
            <p className="text-vicky-primary/60 max-w-lg mx-auto font-outfit">
              A showcase of transformations, from natural enhancements to bold editorial statements.
            </p>
          </div>

          {/* Categories - Mobile Scrollable */}
          <div className="flex overflow-x-auto pb-8 hide-scrollbar justify-start gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-8 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-300 font-outfit ${
                  activeCategory === category.id
                    ? 'bg-vicky-accent text-white shadow-lg'
                    : 'glassmorphism text-vicky-primary hover:bg-vicky-accent/10'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Gallery Grid - Mobile */}
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative group cursor-pointer"
                onClick={() => setSelectedImage(item.image_url)}
              >
                <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {item.is_featured && (
                  <div className="absolute top-2 right-2 bg-vicky-gold text-white px-2 py-1 rounded-full text-xs font-bold font-outfit">
                    Featured
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-white font-bold text-sm font-outfit">{item.title}</h3>
                    <p className="text-white/80 text-xs font-outfit">{item.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW (Redesigned Gallery) */}
      <div className="hidden md:flex min-h-screen bg-gradient-to-br from-[#FFF5F7] via-white to-[#FCE4EC]">
        {/* Enhanced Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-vicky-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-vicky-gold/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-[1px] h-1/2 bg-vicky-gold/20 transform rotate-45" />
          <div className="absolute top-1/4 right-1/4 w-1/2 h-[1px] bg-vicky-gold/20 transform rotate-45" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-8 py-12">
          {/* Enhanced Header */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-block px-6 py-3 rounded-full bg-vicky-accent/10 border border-vicky-accent/20 mb-6"
              >
                <span className="text-sm font-bold tracking-widest text-vicky-accent uppercase font-outfit">Our Work</span>
              </motion.div>
              
              <span className="font-luxury text-6xl text-vicky-accent block mb-4">Portfolio</span>
              <h1 className="text-8xl font-bold text-vicky-primary font-outfit leading-none mb-6">
                Visual <span className="text-vicky-gold">Storytelling</span>
              </h1>
              <p className="text-xl text-vicky-primary/70 font-outfit italic max-w-3xl mx-auto leading-relaxed">
                "Every face is a canvas, and every look is a masterpiece in progress."
              </p>
            </motion.div>
          </div>

          {/* Enhanced Category Navigation */}
          <div className="flex justify-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex gap-8 bg-white/60 backdrop-blur-sm rounded-full px-10 py-6 shadow-xl border border-vicky-border/20"
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`relative text-sm font-bold uppercase tracking-[0.15em] font-outfit transition-all duration-300 px-6 py-3 rounded-full ${
                    activeCategory === category.id
                      ? 'bg-vicky-accent text-white shadow-lg'
                      : 'text-vicky-primary/50 hover:text-vicky-primary hover:bg-vicky-accent/10'
                  }`}
                >
                  {category.name}
                  {activeCategory === category.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-vicky-accent rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Masonry Gallery Grid */}
          <div className="columns-4 gap-6 mb-16">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                whileHover={{ 
                  scale: 1.02, 
                  zIndex: 10,
                }}
                className="group relative overflow-hidden rounded-3xl shadow-xl cursor-pointer bg-white mb-6 break-inside-avoid"
                onClick={() => setSelectedImage(item.image_url)}
                style={{
                  aspectRatio: index % 3 === 0 ? '3/4' : index % 3 === 1 ? '4/5' : '3/4'
                }}
              >
                {/* Image */}
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
                
                {/* Featured Badge */}
                {item.is_featured && (
                  <div className="absolute top-4 right-4 z-20">
                    <div className="bg-vicky-gold text-white px-3 py-1 rounded-full text-xs font-bold font-outfit flex items-center space-x-1">
                      <span>⭐</span>
                      <span>Featured</span>
                    </div>
                  </div>
                )}
                
                {/* Enhanced Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-vicky-primary/95 via-vicky-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                
                {/* Hover Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white font-outfit">{item.title}</h3>
                        <p className="text-sm text-white/80 font-outfit capitalize">{item.category?.replace('-', ' ')}</p>
                      </div>
                    </div>
                    {item.description && (
                      <p className="text-white/90 text-sm font-outfit line-clamp-2 mb-4">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-white/80 text-xs font-outfit">
                        <span>❤️ {item.likes || 0}</span>
                        <span>📸 {item.category}</span>
                      </div>
                      <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold font-outfit hover:bg-white/30 transition-all">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enhanced Frame decoration */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-vicky-accent/40 transition-all duration-500" />
                
                {/* Floating number badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                  className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center font-bold text-sm font-outfit opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  {index + 1}
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Footer CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-between items-center pt-12 border-t border-vicky-gold/20 bg-white/40 backdrop-blur-sm rounded-3xl p-8"
          >
            <div className="flex items-center space-x-8">
              <div className="space-y-2">
                <p className="text-sm font-outfit font-bold text-vicky-primary/40 uppercase tracking-[0.2em]">Follow our journey</p>
                <a 
                  href="https://instagram.com/beautybyvicky___" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-2xl font-luxury text-vicky-accent hover:text-vicky-gold transition-colors block"
                >
                  @beautybyvicky___
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-px h-12 bg-vicky-gold/20" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-vicky-accent font-outfit">6+</p>
                  <p className="text-xs uppercase tracking-wider text-vicky-primary/50">Years of Artistry</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/services" className="group border-2 border-vicky-accent text-vicky-accent px-6 py-3 rounded-full text-lg font-bold font-outfit hover:bg-vicky-accent hover:text-white transition-all duration-300">
                View Services
              </Link>
              <Link to="/booking" className="group bg-vicky-primary text-white px-8 py-4 rounded-full text-lg font-bold font-outfit shadow-xl hover:bg-vicky-accent hover:shadow-vicky-accent/30 transition-all duration-300 flex items-center space-x-3">
                <span>Book Your Session</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-vicky-primary/95 backdrop-blur-2xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: 3 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8, rotate: -3 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Gallery item"
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
