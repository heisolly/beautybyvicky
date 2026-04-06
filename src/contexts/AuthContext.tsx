import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  last_login?: string;
}

interface AuthContextType {
  admin: Admin | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedAdmin = localStorage.getItem('admin_session');
        if (storedAdmin) {
          const adminData = JSON.parse(storedAdmin);
          // Verify the session is still valid (you could add a token validation here)
          setAdmin(adminData);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        localStorage.removeItem('admin_session');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // For demo purposes, we'll use a simple password check
      // In production, you'd want to use proper authentication
      if (password === 'admin123') {
        // Fetch admin user from database
        const { data: adminData, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', email)
          .eq('is_active', true)
          .single();

        if (error || !adminData) {
          return { success: false, error: 'Invalid credentials' };
        }

        // Update last login
        await supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', adminData.id);

        setAdmin(adminData);
        localStorage.setItem('admin_session', JSON.stringify(adminData));
        return { success: true };
      } else {
        return { success: false, error: 'Invalid password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin_session');
  };

  const value: AuthContextType = {
    admin,
    login,
    logout,
    loading,
    isAuthenticated: !!admin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
