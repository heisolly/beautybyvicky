-- beautybyvicky Database Schema
-- This file contains all the necessary tables for the makeup artist website

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration VARCHAR(50),
  category VARCHAR(50),
  image_url TEXT,
  features TEXT[],
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  client_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  date DATE NOT NULL,
  time VARCHAR(10) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  total_amount DECIMAL(10,2),
  deposit_paid BOOLEAN DEFAULT FALSE,
  balance_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  image_url TEXT NOT NULL,
  before_image_url TEXT,
  after_image_url TEXT,
  likes INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name VARCHAR(100) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  testimonial TEXT NOT NULL,
  service_type VARCHAR(100),
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQ items table
CREATE TABLE IF NOT EXISTS faq_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(100) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table (for admin panel access)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial services data
INSERT INTO services (name, description, price, duration, category, features, is_popular) VALUES
('Bridal Glam', 'Complete bridal makeup transformation with flawless long-lasting finish', 350.00, '2-3 hours', 'bridal', ARRAY['Pre-bridal consultation', 'Waterproof makeup', 'False lashes included', 'Touch-up kit', 'Trial session available'], true),
('Soft/Natural Glam', 'Enhanced natural beauty with soft, radiant makeup look', 150.00, '1 hour', 'natural', ARRAY['Skin preparation', 'Natural contour', 'Soft glam finish', 'Basic lashes', 'Skincare tips'], false),
('Full Editorial/Photoshoot', 'High-impact editorial makeup perfect for photoshoots and special events', 400.00, '2 hours', 'editorial', ARRAY['Creative makeup design', 'Professional contour', 'Dramatic lashes', 'Color matching', 'Photography consultation'], false),
('Home Service/Travel', 'Convenient at-home makeup service with travel included', 100.00, 'Varies', 'travel', ARRAY['Travel to your location', 'Portable makeup kit', 'Flexible timing', 'Group discounts available', 'Emergency services'], false)
ON CONFLICT DO NOTHING;

-- Insert initial FAQ data
INSERT INTO faq_items (question, answer, category, sort_order) VALUES
('Do you travel to venues?', 'Yes! I offer home service and can travel to your venue for an additional fee. I serve the Greater Los Angeles area and can discuss travel options for locations outside my standard service area.', 'services', 1),
('What brands are in your kit?', 'I use only premium, professional-grade brands including MAC Cosmetics, NARS, Fenty Beauty, Charlotte Tilbury, Anastasia Beverly Hills, and Huda Beauty. All products are cruelty-free and suitable for various skin types.', 'products', 2),
('How do I prepare my skin?', 'For best results, please arrive with a clean, moisturized face. Avoid using heavy skincare products or exfoliants 24 hours before your appointment.', 'preparation', 3),
('What is your cancellation policy?', 'Cancellations must be made at least 48 hours in advance for a full refund of your deposit. Cancellations within 48 hours will forfeit the deposit.', 'booking', 4)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_category ON portfolio_items(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_featured ON portfolio_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(is_approved);
CREATE INDEX IF NOT EXISTS idx_faq_items_active ON faq_items(is_active);
CREATE INDEX IF NOT EXISTS idx_faq_items_category ON faq_items(category);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_items_updated_at BEFORE UPDATE ON portfolio_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faq_items_updated_at BEFORE UPDATE ON faq_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public can insert bookings (but not read others' data)
CREATE POLICY "Users can insert bookings" ON bookings
    FOR INSERT WITH CHECK (true);

-- Public can insert contact submissions
CREATE POLICY "Users can insert contact submissions" ON contact_submissions
    FOR INSERT WITH CHECK (true);

-- Public can insert newsletter subscribers
CREATE POLICY "Users can insert newsletter subscribers" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Admin users can read all data (this would be implemented with proper auth)
-- Note: In production, you'd want to implement proper authentication with Supabase Auth
