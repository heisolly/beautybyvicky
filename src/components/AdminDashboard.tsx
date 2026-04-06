import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Star, 
  Image, 
  HelpCircle, 
  Mail, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  DollarSign,
  Clock
} from 'lucide-react';
import ServicesManager from './admin/ServicesManager';
import BookingsManager from './admin/BookingsManager';

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  totalClients: number;
  portfolioItems: number;
  testimonials: number;
  unreadMessages: number;
  subscribers: number;
}

const AdminDashboard: React.FC = () => {
  const { admin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    totalClients: 0,
    portfolioItems: 0,
    testimonials: 0,
    unreadMessages: 0,
    subscribers: 0,
  });
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data
      const [
        bookingsResult,
        servicesResult,
        portfolioResult,
        testimonialsResult,
        contactResult,
        subscribersResult
      ] = await Promise.all([
        supabase.from('bookings').select('*'),
        supabase.from('services').select('*'),
        supabase.from('portfolio_items').select('*'),
        supabase.from('testimonials').select('*'),
        supabase.from('contact_submissions').select('*'),
        supabase.from('newsletter_subscribers').select('*')
      ]);

      const bookings = bookingsResult.data || [];
      const services = servicesResult.data || [];
      const portfolio = portfolioResult.data || [];
      const testimonials = testimonialsResult.data || [];
      const contacts = contactResult.data || [];
      const subscribers = subscribersResult.data || [];

      // Calculate stats
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
        testimonials: testimonials.length,
        unreadMessages: contacts.filter(c => c.status === 'new').length,
        subscribers: subscribers.length,
      });

      setData({
        bookings,
        services,
        portfolio,
        testimonials,
        contacts,
        subscribers
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<Calendar className="h-6 w-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Pending Bookings"
          value={stats.pendingBookings}
          icon={<Clock className="h-6 w-6 text-white" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={<DollarSign className="h-6 w-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-purple-500"
        />
        <StatCard
          title="Portfolio Items"
          value={stats.portfolioItems}
          icon={<Image className="h-6 w-6 text-white" />}
          color="bg-pink-500"
        />
        <StatCard
          title="Testimonials"
          value={stats.testimonials}
          icon={<Star className="h-6 w-6 text-white" />}
          color="bg-indigo-500"
        />
        <StatCard
          title="Unread Messages"
          value={stats.unreadMessages}
          icon={<MessageSquare className="h-6 w-6 text-white" />}
          color="bg-red-500"
        />
        <StatCard
          title="Newsletter Subscribers"
          value={stats.subscribers}
          icon={<Mail className="h-6 w-6 text-white" />}
          color="bg-teal-500"
        />
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.bookings?.slice(0, 5).map((booking: any) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.client_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {data.services?.find((s: any) => s.id === booking.service_id)?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${booking.total_amount || '0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Portfolio Management</h3>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Portfolio management features coming soon...</p>
      </div>
    </div>
  );

  const renderTestimonials = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Testimonials Management</h3>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Testimonials management features coming soon...</p>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Contact Messages</h3>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Message management features coming soon...</p>
      </div>
    </div>
  );

  const renderFAQ = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">FAQ Management</h3>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">FAQ management features coming soon...</p>
      </div>
    </div>
  );

  const renderNewsletter = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Newsletter Subscribers</h3>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Newsletter management features coming soon...</p>
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
        return renderPortfolio();
      case 'testimonials':
        return renderTestimonials();
      case 'messages':
        return renderMessages();
      case 'faq':
        return renderFAQ();
      case 'newsletter':
        return renderNewsletter();
      default:
        return renderDashboard();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Beauty by Vicky's Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {admin?.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 flex items-center"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md min-h-screen">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`${
                  activeTab === 'dashboard'
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
              >
                <TrendingUp className="mr-3 h-5 w-5" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`${
                  activeTab === 'bookings'
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
              >
                <Calendar className="mr-3 h-5 w-5" />
                Bookings
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`${
                  activeTab === 'services'
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
              >
                <Settings className="mr-3 h-5 w-5" />
                Services
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`${
                  activeTab === 'portfolio'
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
              >
                <Image className="mr-3 h-5 w-5" />
                Portfolio
              </button>
              <button
                onClick={() => setActiveTab('testimonials')}
                className={`${
                  activeTab === 'testimonials'
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
              >
                <Star className="mr-3 h-5 w-5" />
                Testimonials
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`${
                  activeTab === 'messages'
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
              >
                <MessageSquare className="mr-3 h-5 w-5" />
                Contact Messages
                {stats.unreadMessages > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {stats.unreadMessages}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`${
                  activeTab === 'faq'
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
              >
                <HelpCircle className="mr-3 h-5 w-5" />
                FAQ
              </button>
              <button
                onClick={() => setActiveTab('newsletter')}
                className={`${
                  activeTab === 'newsletter'
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
              >
                <Mail className="mr-3 h-5 w-5" />
                Newsletter
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
