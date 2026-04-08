import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);
    
    if (!result.success && result.error) {
      alert(result.error);
    }
    
    setIsLoading(false);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#FFF5F7] via-white to-[#FCE4EC] flex items-center justify-center p-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-vicky-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-vicky-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-12 gap-24 items-center">
          {/* Left: Admin Sidebar */}
          <div className="col-span-5 space-y-12">
            <div className="space-y-6">
              <span className="font-luxury text-7xl text-vicky-accent block">Admin</span>
              <h1 className="text-8xl font-bold text-vicky-primary font-outfit leading-[0.8] tracking-tighter">
                Beauty <br />
                <span className="text-vicky-gold">Control</span>
              </h1>
            </div>
            
            <div className="space-y-8">
              <p className="text-2xl text-vicky-primary/60 font-outfit leading-relaxed">
                Manage your beauty empire with powerful tools and insights. Transform your business with data-driven decisions.
              </p>

              <div className="space-y-6 pt-8 border-t border-vicky-gold/20">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-vicky-accent/10 rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6 text-vicky-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-vicky-primary font-outfit">Secure Access</h3>
                    <p className="text-vicky-primary/60 font-outfit">Protected authentication system</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-vicky-gold/10 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-vicky-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-vicky-primary font-outfit">Business Management</h3>
                    <p className="text-vicky-primary/60 font-outfit">Complete control over operations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Login Form */}
          <div className="col-span-7">
            <div className="bg-white p-16 rounded-[4rem] shadow-[0_80px_150px_-30px_rgba(45,27,34,0.15)] min-h-[600px] flex flex-col justify-center">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold text-vicky-primary font-outfit mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-xl text-vicky-primary/60 font-outfit">
                    Sign in to manage your beauty business
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-medium text-vicky-primary mb-3 font-outfit">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-6 w-6 text-vicky-primary/40" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border-2 border-vicky-primary/20 rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none transition-all text-lg font-outfit"
                        placeholder="admin@beautybyvicky.com"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-vicky-primary mb-3 font-outfit">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-6 w-6 text-vicky-primary/40" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-14 py-4 border-2 border-vicky-primary/20 rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none transition-all text-lg font-outfit"
                        placeholder="Enter your password"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-6 w-6 text-vicky-primary/40 hover:text-vicky-primary transition-colors" />
                        ) : (
                          <Eye className="h-6 w-6 text-vicky-primary/40 hover:text-vicky-primary transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-vicky-accent text-white py-5 px-8 rounded-2xl text-xl font-bold font-outfit shadow-xl hover:bg-vicky-primary hover:shadow-vicky-primary/30 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                      Signing In...
                    </span>
                  ) : (
                    'Sign In to Admin Panel'
                  )}
                </button>

                <div className="text-center pt-6 border-t border-vicky-gold/20">
                  <p className="text-sm text-vicky-primary/50 font-outfit">
                    Demo Credentials: admin@beautybyvicky.com / 242424
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
