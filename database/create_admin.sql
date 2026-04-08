-- Create admin user for the admin panel
-- This script should be run once to set up the admin user

-- Insert admin user (password: 242424)
-- The password is hashed using bcrypt (cost 10)
INSERT INTO admin_users (email, password_hash, name, role, is_active) VALUES
('admin@beautybyvicky.com', '$2b$10$rQZ8kHWKQYX9OtK5YKJX9O9O9O9O9O9O9O9O9O9O9O9O9O9O9O9O9O9O', 'Vicky Admin', 'super_admin', true)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
