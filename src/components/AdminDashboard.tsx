import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Calendar, 
  MessageSquare, 
  Image, 
  Settings, 
  LogOut,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  Clock,
  RefreshCw
} from 'lucide-react';
import ServicesManager from './admin/ServicesManager';
import BookingsManager from './admin/BookingsManager';
import GalleryManager from './admin/GalleryManager';

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  totalClients: number;
  portfolioItems: number;
  unreadMessages: number;
}

const AdminDashboard: React.FC = () => {
  const { admin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    totalClients: 0,
    portfolioItems: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch essential data only
      const [
        bookingsResult,
        portfolioResult,
        contactResult
      ] = await Promise.all([
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('portfolio_items').select('*'),
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
      ]);

      if (bookingsResult.error) throw bookingsResult.error;
      if (portfolioResult.error) throw portfolioResult.error;
      if (contactResult.error) throw contactResult.error;

      const bookings = bookingsResult.data || [];
      const portfolio = portfolioResult.data || [];
      const contacts = contactResult.data || [];

      // Calculate essential stats
      const totalRevenue = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.total_amount || 0), 0);

      const uniqueClients = new Set(bookings.map(b => b.email)).size;

      setStats({
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        totalRevenue,
        totalClients: uniqueClients,
        portfolioItems: portfolio.length,
        unreadMessages: contacts.filter(c => c.status === 'new').length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: string;
}

  const StatCard = ({ title, value, icon, color, change }: StatCardProps) => (
    <div className={`${color} rounded-2xl p-4 md:p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs md:text-sm font-medium opacity-90 font-outfit">{title}</p>
          <p className="text-2xl md:text-3xl font-bold font-outfit">{value}</p>
          {change && <p className="text-xs md:text-sm opacity-75 font-outfit">{change}</p>}
        </div>
        <div className="opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-vicky-primary font-outfit">Dashboard</h2>
          <p className="text-sm md:text-base text-vicky-primary/60 font-outfit">Welcome back, {admin?.name}</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center space-x-2 bg-vicky-accent text-white px-4 py-2 rounded-xl font-bold font-outfit hover:bg-vicky-primary transition-all text-sm md:text-base"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<Calendar className="h-6 w-6 md:h-8 md:w-8" />}
          color="bg-vicky-accent"
          change="This month"
        />
        <StatCard
          title="Pending"
          value={stats.pendingBookings}
          icon={<Clock className="h-6 w-6 md:h-8 md:w-8" />}
          color="bg-orange-500"
          change="Action needed"
        />
        <StatCard
          title="Revenue"
          value={`₦${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6 md:h-8 md:w-8" />}
          color="bg-green-600"
          change="Total earned"
        />
        <StatCard
          title="Clients"
          value={stats.totalClients}
          icon={<TrendingUp className="h-6 w-6 md:h-8 md:w-8" />}
          color="bg-blue-600"
          change="Unique clients"
        />
        <StatCard
          title="Gallery"
          value={stats.portfolioItems}
          icon={<Image className="h-6 w-6 md:h-8 md:w-8" />}
          color="bg-purple-600"
          change="Portfolio items"
        />
        <StatCard
          title="Messages"
          value={stats.unreadMessages}
          icon={<MessageSquare className="h-6 w-6 md:h-8 md:w-8" />}
          color="bg-red-600"
          change="Unread"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-vicky-primary font-outfit mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActiveTab('bookings')}
            className="flex flex-col items-center justify-center p-4 bg-vicky-accent/10 rounded-xl hover:bg-vicky-accent/20 transition-all"
          >
            <Calendar className="w-6 h-6 text-vicky-accent mb-2" />
            <span className="text-sm font-bold text-vicky-primary font-outfit">View Bookings</span>
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className="flex flex-col items-center justify-center p-4 bg-vicky-accent/10 rounded-xl hover:bg-vicky-accent/20 transition-all"
          >
            <Settings className="w-6 h-6 text-vicky-accent mb-2" />
            <span className="text-sm font-bold text-vicky-primary font-outfit">Manage Services</span>
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className="flex flex-col items-center justify-center p-4 bg-vicky-accent/10 rounded-xl hover:bg-vicky-accent/20 transition-all"
          >
            <Image className="w-6 h-6 text-vicky-accent mb-2" />
            <span className="text-sm font-bold text-vicky-primary font-outfit">Update Gallery</span>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className="flex flex-col items-center justify-center p-4 bg-vicky-accent/10 rounded-xl hover:bg-vicky-accent/20 transition-all relative"
          >
            <MessageSquare className="w-6 h-6 text-vicky-accent mb-2" />
            <span className="text-sm font-bold text-vicky-primary font-outfit">Messages</span>
            {stats.unreadMessages > 0 && (
              <span className="absolute top-2 right-2 w-5 h-5 bg-red-600 text-white rounded-full text-xs font-bold flex items-center justify-center">
                {stats.unreadMessages}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'bookings':
        return <BookingsManager />;
      case 'services':
        return <ServicesManager />;
      case 'portfolio':
        return <GalleryManager />;
      case 'messages':
        return renderMessages();
      default:
        return renderDashboard();
    }
  };

  const renderMessages = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-vicky-primary font-outfit">Messages</h3>
          <p className="text-sm md:text-base text-vicky-primary/60 font-outfit">Customer inquiries and contact forms</p>
        </div>
        {stats.unreadMessages > 0 && (
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold font-outfit">
            {stats.unreadMessages} Unread
          </span>
        )}
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
        <p className="text-vicky-primary/60 font-outfit">Message management features coming soon...</p>
      </div>
    </div>
  );

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'bookings', label: 'Bookings', icon: Calendar, badge: stats.pendingBookings },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'portfolio', label: 'Gallery', icon: Image },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: stats.unreadMessages },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-vicky-bg flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-vicky-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vicky-bg">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-vicky-primary/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-vicky-accent/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-vicky-primary" /> : <Menu className="w-6 h-6 text-vicky-primary" />}
            </button>
            <h1 className="text-lg font-bold text-vicky-primary font-outfit">Admin Panel</h1>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-vicky-accent/10 transition-colors"
          >
            <LogOut className="w-5 h-5 text-vicky-primary" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white w-80 h-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-vicky-primary/10">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-vicky-accent rounded-full flex items-center justify-center">
                  <span className="text-white font-bold font-outfit text-lg">
                    {admin?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-bold text-vicky-primary font-outfit">{admin?.name}</p>
                  <p className="text-sm text-vicky-primary/60 font-outfit">Administrator</p>
                </div>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold font-outfit transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-vicky-accent text-white shadow-lg'
                      : 'text-vicky-primary/60 hover:bg-vicky-accent/10 hover:text-vicky-primary'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 && (
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold font-outfit text-red-600 hover:bg-red-50 transition-all duration-300 mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Desktop Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6 border-b border-vicky-primary/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-vicky-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold font-outfit text-lg">
                  {admin?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <p className="text-lg font-bold text-vicky-primary font-outfit">{admin?.name}</p>
                <p className="text-sm text-vicky-primary/60 font-outfit">Administrator</p>
              </div>
            </div>
          </div>
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold font-outfit transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-vicky-accent text-white shadow-lg'
                    : 'text-vicky-primary/60 hover:bg-vicky-accent/10 hover:text-vicky-primary'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 && (
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-vicky-primary/10">
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold font-outfit text-red-600 hover:bg-red-50 transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Desktop Content */}
        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>
      </div>

      {/* Mobile Content */}
      <div className="lg:hidden p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
