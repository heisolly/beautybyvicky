import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, Phone, Mail, Eye, CheckCircle, XCircle, Clock, Search, Filter, DollarSign, MapPin, X, Edit, Save } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface Booking {
  id: string;
  service_id?: string;
  client_name: string;
  email: string;
  phone?: string;
  address?: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  total_amount?: number;
  deposit_paid: boolean;
  balance_paid: boolean;
  created_at: string;
  service?: {
    name: string;
    price: number;
  };
}

interface Service {
  id: string;
  name: string;
  price: number;
}

const BookingsManager: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch bookings with service details
      const [bookingsResult, servicesResult] = await Promise.all([
        supabase
          .from('bookings')
          .select(`
            *,
            services (
              name,
              price
            )
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('services')
          .select('id, name, price')
          .order('name')
      ]);

      if (bookingsResult.error) throw bookingsResult.error;
      if (servicesResult.error) throw servicesResult.error;

      setBookings(bookingsResult.data || []);
      setServices(servicesResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch bookings. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) throw error;
      
      showToast({
        type: 'success',
        title: 'Status Updated',
        message: `Booking status has been updated to ${status}.`
      });
      
      await fetchData();
    } catch (error) {
      console.error('Error updating booking status:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update booking status. Please try again.'
      });
    }
  };

  const updatePaymentStatus = async (bookingId: string, field: 'deposit_paid' | 'balance_paid', value: boolean) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) throw error;
      
      showToast({
        type: 'success',
        title: 'Payment Updated',
        message: `Payment status has been updated.`
      });
      
      await fetchData();
    } catch (error) {
      console.error('Error updating payment status:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update payment status. Please try again.'
      });
    }
  };

  const updateBooking = async (booking: Booking) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          client_name: booking.client_name,
          email: booking.email,
          phone: booking.phone,
          address: booking.address,
          date: booking.date,
          time: booking.time,
          service_id: booking.service_id,
          total_amount: booking.total_amount,
          notes: booking.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', booking.id);

      if (error) throw error;
      
      showToast({
        type: 'success',
        title: 'Booking Updated',
        message: 'Booking has been updated successfully.'
      });
      
      await fetchData();
      setEditingBooking(null);
    } catch (error) {
      console.error('Error updating booking:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update booking. Please try again.'
      });
    }
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking({ ...booking });
  };

  const handleSaveEdit = () => {
    if (!editingBooking) return;
    
    // Validate required fields
    if (!editingBooking.client_name || !editingBooking.email || !editingBooking.date || !editingBooking.time) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields.'
      });
      return;
    }
    
    updateBooking(editingBooking);
  };

  const deleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) return;
    
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;
      
      showToast({
        type: 'success',
        title: 'Booking Deleted',
        message: 'Booking has been deleted successfully.'
      });
      
      await fetchData();
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error deleting booking:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete booking. Please try again.'
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingBooking(null);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = 
      booking.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-vicky-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-bold text-vicky-primary font-outfit mb-2">Bookings Management</h3>
          <p className="text-lg text-vicky-primary/60 font-outfit">Manage appointments and client bookings</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-vicky-primary/40" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-vicky-primary/20 rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none font-outfit"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-vicky-primary/40" />
          <div className="flex space-x-2">
            {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-bold font-outfit transition-all duration-300 ${
                  filter === status
                    ? 'bg-vicky-accent text-white shadow-lg'
                    : 'bg-vicky-primary/10 text-vicky-primary hover:bg-vicky-primary/20'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-vicky-gold/10">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h4 className="text-xl font-bold text-vicky-primary font-outfit mb-1">{booking.client_name}</h4>
                <p className="text-sm text-vicky-primary/60 font-outfit">{booking.email}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-outfit border flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
                {getStatusIcon(booking.status)}
                <span>{booking.status}</span>
              </span>
            </div>

            {/* Service Info */}
            <div className="mb-4">
              <p className="text-lg font-bold text-vicky-primary font-outfit mb-1">
                {booking.service?.name || 'Service Not Found'}
              </p>
              {booking.total_amount && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-vicky-accent" />
                  <span className="text-lg font-bold text-vicky-primary font-outfit">${booking.total_amount}</span>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              {booking.phone && (
                <div className="flex items-center space-x-2 text-sm text-vicky-primary/60 font-outfit">
                  <Phone className="w-4 h-4 text-vicky-accent" />
                  <span>{booking.phone}</span>
                </div>
              )}
              {booking.address && (
                <div className="flex items-center space-x-2 text-sm text-vicky-primary/60 font-outfit">
                  <MapPin className="w-4 h-4 text-vicky-accent" />
                  <span>{booking.address}</span>
                </div>
              )}
            </div>

            {/* Schedule */}
            <div className="flex items-center space-x-4 mb-4 p-3 bg-vicky-bg rounded-xl">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-vicky-accent" />
                <span className="text-sm font-bold text-vicky-primary font-outfit">{booking.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-vicky-accent" />
                <span className="text-sm font-bold text-vicky-primary font-outfit">{booking.time}</span>
              </div>
            </div>

            {/* Payment Status */}
            <div className="mb-4">
              <p className="text-sm font-bold text-vicky-primary font-outfit mb-2">Payment Status</p>
              <div className="flex space-x-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={booking.deposit_paid}
                    onChange={(e) => updatePaymentStatus(booking.id, 'deposit_paid', e.target.checked)}
                    className="w-4 h-4 text-vicky-accent border-2 border-vicky-primary/20 rounded focus:ring-2 focus:ring-vicky-accent"
                  />
                  <span className="text-sm font-medium text-vicky-primary font-outfit">Deposit</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={booking.balance_paid}
                    onChange={(e) => updatePaymentStatus(booking.id, 'balance_paid', e.target.checked)}
                    className="w-4 h-4 text-vicky-accent border-2 border-vicky-primary/20 rounded focus:ring-2 focus:ring-vicky-accent"
                  />
                  <span className="text-sm font-medium text-vicky-primary font-outfit">Balance</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 pt-4 border-t border-vicky-gold/10">
              <button
                onClick={() => setSelectedBooking(booking)}
                className="flex-1 flex items-center justify-center space-x-2 bg-vicky-accent/10 text-vicky-accent py-2 rounded-xl font-bold font-outfit hover:bg-vicky-accent hover:text-white transition-all duration-300"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(booking)}
                  className="px-3 py-2 bg-blue-100 text-blue-700 rounded-xl font-bold font-outfit hover:bg-blue-200 transition-all duration-300"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {booking.status === 'pending' && (
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded-xl font-bold font-outfit hover:bg-green-200 transition-all duration-300"
                  >
                    Confirm
                  </button>
                )}
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'completed')}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded-xl font-bold font-outfit hover:bg-green-200 transition-all duration-300"
                  >
                    Complete
                  </button>
                )}
                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-xl font-bold font-outfit hover:bg-red-200 transition-all duration-300"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => deleteBooking(booking.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded-xl font-bold font-outfit hover:bg-red-700 transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-vicky-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-vicky-accent" />
          </div>
          <h4 className="text-xl font-bold text-vicky-primary font-outfit mb-2">No bookings found</h4>
          <p className="text-vicky-primary/60 font-outfit">
            {searchTerm ? 'Try adjusting your search terms' : 'No bookings match the current filter'}
          </p>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-vicky-gold/10">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-vicky-primary font-outfit">Booking Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 bg-vicky-primary/10 text-vicky-primary rounded-xl hover:bg-vicky-primary/20 transition-all duration-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-vicky-primary font-outfit mb-3">Client Information</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-bold text-vicky-primary font-outfit">Name</p>
                      <p className="text-vicky-primary/80 font-outfit">{selectedBooking.client_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-vicky-primary font-outfit">Email</p>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-vicky-accent" />
                        <p className="text-vicky-primary/80 font-outfit">{selectedBooking.email}</p>
                      </div>
                    </div>
                    {selectedBooking.phone && (
                      <div>
                        <p className="text-sm font-bold text-vicky-primary font-outfit">Phone</p>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-vicky-accent" />
                          <p className="text-vicky-primary/80 font-outfit">{selectedBooking.phone}</p>
                        </div>
                      </div>
                    )}
                    {selectedBooking.address && (
                      <div>
                        <p className="text-sm font-bold text-vicky-primary font-outfit">Address</p>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-vicky-accent" />
                          <p className="text-vicky-primary/80 font-outfit">{selectedBooking.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Service & Schedule */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-vicky-primary font-outfit mb-3">Service & Schedule</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-bold text-vicky-primary font-outfit">Service</p>
                      <p className="text-vicky-primary/80 font-outfit">{selectedBooking.service?.name || 'N/A'}</p>
                    </div>
                    {selectedBooking.total_amount && (
                      <div>
                        <p className="text-sm font-bold text-vicky-primary font-outfit">Total Amount</p>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-vicky-accent" />
                          <p className="text-lg font-bold text-vicky-primary font-outfit">${selectedBooking.total_amount}</p>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-vicky-primary font-outfit">Date</p>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-vicky-accent" />
                        <p className="text-vicky-primary/80 font-outfit">{selectedBooking.date}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-vicky-primary font-outfit">Time</p>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-vicky-accent" />
                        <p className="text-vicky-primary/80 font-outfit">{selectedBooking.time}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-vicky-primary font-outfit">Status</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold font-outfit border ${getStatusColor(selectedBooking.status)}`}>
                        {getStatusIcon(selectedBooking.status)}
                        <span className="ml-1">{selectedBooking.status}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="mt-6">
                  <h4 className="text-lg font-bold text-vicky-primary font-outfit mb-3">Notes</h4>
                  <div className="p-4 bg-vicky-bg rounded-xl">
                    <p className="text-vicky-primary/80 font-outfit">{selectedBooking.notes}</p>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h4 className="text-lg font-bold text-vicky-primary font-outfit mb-3">Payment Status</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 bg-vicky-bg rounded-xl cursor-pointer hover:bg-vicky-accent/10 transition-all duration-300">
                    <input
                      type="checkbox"
                      checked={selectedBooking.deposit_paid}
                      onChange={(e) => updatePaymentStatus(selectedBooking.id, 'deposit_paid', e.target.checked)}
                      className="w-5 h-5 text-vicky-accent border-2 border-vicky-primary/20 rounded focus:ring-2 focus:ring-vicky-accent"
                    />
                    <span className="text-sm font-bold text-vicky-primary font-outfit">Deposit Paid</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 bg-vicky-bg rounded-xl cursor-pointer hover:bg-vicky-accent/10 transition-all duration-300">
                    <input
                      type="checkbox"
                      checked={selectedBooking.balance_paid}
                      onChange={(e) => updatePaymentStatus(selectedBooking.id, 'balance_paid', e.target.checked)}
                      className="w-5 h-5 text-vicky-accent border-2 border-vicky-primary/20 rounded focus:ring-2 focus:ring-vicky-accent"
                    />
                    <span className="text-sm font-bold text-vicky-primary font-outfit">Balance Paid</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Booking Modal */}
      {editingBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-vicky-gold/10">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-vicky-primary font-outfit">Edit Booking</h3>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 bg-vicky-primary/10 text-vicky-primary rounded-xl hover:bg-vicky-primary/20 transition-all duration-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-vicky-primary font-outfit mb-3">Client Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-vicky-primary mb-2 font-outfit">Name *</label>
                    <input
                      type="text"
                      value={editingBooking.client_name}
                      onChange={(e) => setEditingBooking({ ...editingBooking, client_name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-vicky-primary/20 rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none font-outfit"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-vicky-primary mb-2 font-outfit">Email *</label>
                    <input
                      type="email"
                      value={editingBooking.email}
                      onChange={(e) => setEditingBooking({ ...editingBooking, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-vicky-primary/20 rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none font-outfit"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-vicky-primary mb-2 font-outfit">Phone</label>
                    <input
                      type="tel"
                      value={editingBooking.phone || ''}
                      onChange={(e) => setEditingBooking({ ...editingBooking, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-vicky-primary/20 rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none font-outfit"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-vicky-primary mb-2 font-outfit">Address</label>
                    <input
                      type="text"
                      value={editingBooking.address || ''}
                      onChange={(e) => setEditingBooking({ ...editingBooking, address: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-vicky-primary/20 rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none font-outfit"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    />
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-vicky-primary font-outfit mb-3">Booking Details</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-vicky-primary mb-2 font-outfit">Service</label>
                    <select
                      value={editingBooking.service_id || ''}
                      onChange={(e) => setEditingBooking({ ...editingBooking, service_id: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-vicky-primary/20 rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none font-outfit"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      <option value="">Select a service</option>
                      {services.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name} - ₦{service.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-vicky-primary mb-2 font-outfit">Date *</label>
                    <input
                      type="date"
                      value={editingBooking.date}
                      onChange={(e) => setEditingBooking({ ...editingBooking, date: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-vicky-primary/20 rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none font-outfit"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-vicky-primary mb-2 font-outfit">Time *</label>
                    <input
                      type="time"
                      value={editingBooking.time}
                      onChange={(e) => setEditingBooking({ ...editingBooking, time: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-vicky-primary/20 rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none font-outfit"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-vicky-primary mb-2 font-outfit">Total Amount</label>
                    <input
                      type="number"
                      value={editingBooking.total_amount || ''}
                      onChange={(e) => setEditingBooking({ ...editingBooking, total_amount: parseFloat(e.target.value) || undefined })}
                      className="w-full px-4 py-3 border-2 border-vicky-primary/20 rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none font-outfit"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-vicky-primary mb-2 font-outfit">Notes</label>
                <textarea
                  value={editingBooking.notes || ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-vicky-primary/20 rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none resize-none font-outfit"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                  placeholder="Additional notes about this booking..."
                />
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-3 bg-vicky-primary/10 text-vicky-primary rounded-2xl font-bold font-outfit hover:bg-vicky-primary/20 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-3 bg-vicky-accent text-white rounded-2xl font-bold font-outfit hover:bg-vicky-primary transition-all duration-300 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsManager;
