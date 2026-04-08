import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, Save, X, Search, Star, Clock, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface Service {
  id?: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  image_url?: string;
  features: string[];
  is_popular: boolean;
  created_at?: string;
  updated_at?: string;
}

const ServicesManager: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<Service>({
    name: '',
    description: '',
    price: 0,
    duration: '',
    category: '',
    features: [],
    is_popular: false
  });
  const [featureInput, setFeatureInput] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch services. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `services/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast({
        type: 'error',
        title: 'Upload Failed',
        message: 'Failed to upload image. Please try again.'
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setFormData({ ...formData, image_url: imageUrl });
      }
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData(service);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration: '',
      category: '',
      features: [],
      is_popular: false
    });
  };

  const handleSave = async () => {
    try {
      // Validate form
      if (!formData.name || !formData.description || !formData.price || !formData.duration || !formData.category) {
        showToast({
          type: 'error',
          title: 'Validation Error',
          message: 'Please fill in all required fields.'
        });
        return;
      }

      const serviceData = {
        ...formData,
        updated_at: new Date().toISOString()
      };

      if (editingService) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);

        if (error) throw error;
        
        showToast({
          type: 'success',
          title: 'Service Updated',
          message: `${formData.name} has been updated successfully.`
        });
      } else {
        // Create new service
        const { error } = await supabase
          .from('services')
          .insert({
            ...serviceData,
            created_at: new Date().toISOString()
          });

        if (error) throw error;
        
        showToast({
          type: 'success',
          title: 'Service Created',
          message: `${formData.name} has been created successfully.`
        });
      }

      await fetchServices();
      setEditingService(null);
      setIsCreating(false);
      setFormData({
        name: '',
        description: '',
        price: 0,
        duration: '',
        category: '',
        features: [],
        is_popular: false
      });
    } catch (error) {
      console.error('Error saving service:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to save service. Please try again.'
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      showToast({
        type: 'success',
        title: 'Service Deleted',
        message: `${name} has been deleted successfully.`
      });
      
      await fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete service. Please try again.'
      });
    }
  };

  const handleCancel = () => {
    setEditingService(null);
    setIsCreating(false);
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration: '',
      category: '',
      features: [],
      is_popular: false
    });
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h3 className="text-3xl font-bold text-vicky-primary font-outfit mb-2">Services Management</h3>
          <p className="text-lg text-vicky-primary/60 font-outfit">Manage your beauty services and pricing</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-3 bg-vicky-accent text-white px-6 py-3 rounded-2xl font-bold font-outfit hover:bg-vicky-primary transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-vicky-primary/40" />
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-vicky-primary/20 rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none font-outfit"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        />
      </div>

      {/* Edit/Create Form */}
      {(editingService || isCreating) && (
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-vicky-gold/10">
          <h4 className="text-2xl font-bold text-vicky-primary font-outfit mb-6">
            {editingService ? 'Edit Service' : 'Create New Service'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-vicky-primary mb-3 font-outfit">Service Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-vicky-primary/20 rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none font-outfit"
                style={{ fontFamily: 'Outfit, sans-serif' }}
                placeholder="e.g., Bridal Makeup"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-vicky-primary mb-3 font-outfit">Price (₦)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border-2 border-vicky-primary/20 rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none font-outfit"
                style={{ fontFamily: 'Outfit, sans-serif' }}
                placeholder="150000"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-vicky-primary mb-3 font-outfit">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-3 border-2 border-vicky-primary/20 rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none font-outfit"
                style={{ fontFamily: 'Outfit, sans-serif' }}
                placeholder="e.g., 2 hours"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-vicky-primary mb-3 font-outfit">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border-2 border-vicky-primary/20 rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none font-outfit"
                style={{ fontFamily: 'Outfit, sans-serif' }}
                placeholder="e.g., Bridal, Natural"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-lg font-medium text-vicky-primary mb-3 font-outfit">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border-2 border-vicky-primary/20 rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none resize-none font-outfit"
                style={{ fontFamily: 'Outfit, sans-serif' }}
                placeholder="Describe your service..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-lg font-medium text-vicky-primary mb-3 font-outfit">Service Image</label>
              <div className="flex items-center space-x-6">
                {formData.image_url ? (
                  <div className="relative">
                    <img 
                      src={formData.image_url} 
                      alt="Service preview" 
                      className="w-32 h-32 object-cover rounded-2xl border-2 border-vicky-gold/10"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image_url: undefined })}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-vicky-bg border-2 border-dashed border-vicky-primary/20 rounded-2xl flex flex-col items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-vicky-primary/40 mb-2" />
                    <span className="text-xs text-vicky-primary/40 font-outfit">No image</span>
                  </div>
                )}
                <div>
                  <label className="flex items-center space-x-3 bg-vicky-accent/10 text-vicky-accent px-4 py-2 rounded-xl font-bold font-outfit hover:bg-vicky-accent hover:text-white transition-all duration-300 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-vicky-primary/60 font-outfit mt-2">
                    Recommended: 800x600px, max 2MB
                  </p>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-lg font-medium text-vicky-primary mb-3 font-outfit">Features</label>
              <div className="flex space-x-3 mb-4">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  className="flex-1 px-4 py-3 border-2 border-vicky-primary/20 rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none font-outfit"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                  placeholder="Add a feature"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-6 py-3 bg-vicky-accent text-white rounded-2xl font-bold font-outfit hover:bg-vicky-primary transition-all duration-300"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {formData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-vicky-accent/10 text-vicky-accent font-medium font-outfit"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-2 text-vicky-accent hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.is_popular}
                  onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                  className="w-5 h-5 text-vicky-accent border-2 border-vicky-primary/20 rounded focus:ring-2 focus:ring-vicky-accent"
                />
                <span className="text-lg font-medium text-vicky-primary font-outfit">Popular Service</span>
                <Star className="w-5 h-5 text-vicky-gold" />
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border-2 border-vicky-primary/20 text-vicky-primary rounded-2xl font-bold font-outfit hover:bg-vicky-primary/10 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-3 bg-vicky-accent text-white rounded-2xl font-bold font-outfit hover:bg-vicky-primary transition-all duration-300 flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Service</span>
            </button>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-vicky-gold/10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold text-vicky-primary font-outfit mb-1">{service.name}</h4>
                <p className="text-sm text-vicky-primary/60 font-outfit">{service.category}</p>
              </div>
              {service.is_popular && (
                <div className="bg-vicky-gold/10 p-2 rounded-xl">
                  <Star className="w-5 h-5 text-vicky-gold fill-current" />
                </div>
              )}
            </div>
            
            <p className="text-vicky-primary/80 font-outfit mb-4 line-clamp-2">{service.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-vicky-primary font-outfit">₦{service.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-vicky-accent" />
                  <span className="text-sm text-vicky-primary/60 font-outfit">{service.duration}</span>
                </div>
              </div>
            </div>

            {service.features.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs px-3 py-1 bg-vicky-accent/10 text-vicky-accent rounded-full font-medium font-outfit"
                    >
                      {feature}
                    </span>
                  ))}
                  {service.features.length > 3 && (
                    <span className="text-xs px-3 py-1 bg-vicky-primary/10 text-vicky-primary rounded-full font-medium font-outfit">
                      +{service.features.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 pt-4 border-t border-vicky-gold/10">
              <button
                onClick={() => handleEdit(service)}
                className="flex-1 flex items-center justify-center space-x-2 bg-vicky-accent/10 text-vicky-accent py-2 rounded-xl font-bold font-outfit hover:bg-vicky-accent hover:text-white transition-all duration-300"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => service.id && handleDelete(service.id, service.name)}
                className="flex items-center justify-center p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all duration-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-vicky-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-vicky-accent" />
          </div>
          <h4 className="text-xl font-bold text-vicky-primary font-outfit mb-2">No services found</h4>
          <p className="text-vicky-primary/60 font-outfit">
            {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first service'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;
