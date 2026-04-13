import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Search, 
  Image as ImageIcon, 
  Upload, 
  Star,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Grid,
  List
} from 'lucide-react';

interface PortfolioItem {
  id?: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  before_image_url?: string;
  after_image_url?: string;
  likes: number;
  is_featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

const GalleryManager: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [formData, setFormData] = useState<PortfolioItem>({
    title: '',
    description: '',
    category: '',
    image_url: '',
    before_image_url: '',
    after_image_url: '',
    likes: 0,
    is_featured: false,
    sort_order: 0
  });
  const { showToast } = useToast();

  const categories = [
    'bridal',
    'glamour', 
    'natural',
    'editorial',
    'photoshoot',
    'special-occasions',
    'behind-the-scenes'
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
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load gallery items. Please refresh the page.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsCreating(true);
    setFormData({
      title: '',
      description: '',
      category: '',
      image_url: '',
      before_image_url: '',
      after_image_url: '',
      likes: 0,
      is_featured: false,
      sort_order: portfolioItems.length
    });
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setIsCreating(false);
    setFormData(item);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.image_url) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Title and main image are required.'
      });
      return;
    }

    try {
      if (isCreating) {
        const { error } = await supabase
          .from('portfolio_items')
          .insert({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            image_url: formData.image_url,
            before_image_url: formData.before_image_url || null,
            after_image_url: formData.after_image_url || null,
            likes: formData.likes,
            is_featured: formData.is_featured,
            sort_order: formData.sort_order
          });

        if (error) throw error;
        
        showToast({
          type: 'success',
          title: 'Gallery Item Added',
          message: 'New gallery item has been added successfully.'
        });
      } else {
        const { error } = await supabase
          .from('portfolio_items')
          .update({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            image_url: formData.image_url,
            before_image_url: formData.before_image_url || null,
            after_image_url: formData.after_image_url || null,
            likes: formData.likes,
            is_featured: formData.is_featured,
            sort_order: formData.sort_order,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem?.id);

        if (error) throw error;
        
        showToast({
          type: 'success',
          title: 'Gallery Item Updated',
          message: 'Gallery item has been updated successfully.'
        });
      }
      
      await fetchPortfolioItems();
      handleCancel();
    } catch (error) {
      console.error('Error saving gallery item:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to save gallery item. Please try again.'
      });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      showToast({
        type: 'success',
        title: 'Gallery Item Deleted',
        message: `${title} has been deleted successfully.`
      });
      
      await fetchPortfolioItems();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete gallery item. Please try again.'
      });
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsCreating(false);
    setFormData({
      title: '',
      description: '',
      category: '',
      image_url: '',
      before_image_url: '',
      after_image_url: '',
      likes: 0,
      is_featured: false,
      sort_order: 0
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, imageType: 'main' | 'before' | 'after') => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Show loading state
      showToast({
        type: 'info',
        title: 'Uploading Image',
        message: 'Please wait while the image is being uploaded...'
      });

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Update form data with the actual URL
      if (imageType === 'main') {
        setFormData({ ...formData, image_url: publicUrl });
      } else if (imageType === 'before') {
        setFormData({ ...formData, before_image_url: publicUrl });
      } else if (imageType === 'after') {
        setFormData({ ...formData, after_image_url: publicUrl });
      }

      showToast({
        type: 'success',
        title: 'Image Uploaded',
        message: 'Image has been uploaded successfully.'
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast({
        type: 'error',
        title: 'Upload Failed',
        message: 'Failed to upload image. Please try again.'
      });
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .update({ 
          is_featured: !currentFeatured,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      await fetchPortfolioItems();
      showToast({
        type: 'success',
        title: 'Status Updated',
        message: `Item ${!currentFeatured ? 'featured' : 'unfeatured'} successfully.`
      });
    } catch (error) {
      console.error('Error toggling featured status:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update featured status.'
      });
    }
  };

  const moveItem = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = portfolioItems.findIndex(item => item.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= portfolioItems.length) return;

    const updatedItems = [...portfolioItems];
    const temp = updatedItems[currentIndex].sort_order;
    updatedItems[currentIndex].sort_order = updatedItems[newIndex].sort_order;
    updatedItems[newIndex].sort_order = temp;

    try {
      await Promise.all([
        supabase
          .from('portfolio_items')
          .update({ sort_order: updatedItems[currentIndex].sort_order })
          .eq('id', updatedItems[currentIndex].id),
        supabase
          .from('portfolio_items')
          .update({ sort_order: updatedItems[newIndex].sort_order })
          .eq('id', updatedItems[newIndex].id)
      ]);

      await fetchPortfolioItems();
      showToast({
        type: 'success',
        title: 'Order Updated',
        message: 'Gallery item order has been updated.'
      });
    } catch (error) {
      console.error('Error updating order:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update item order.'
      });
    }
  };

  const filteredItems = portfolioItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-vicky-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-xl md:text-3xl font-bold text-vicky-primary font-outfit">Gallery Management</h3>
          <p className="text-sm md:text-base text-vicky-primary/60 font-outfit">Manage your portfolio and gallery items</p>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="flex bg-white rounded-lg border border-vicky-primary/20 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-vicky-accent text-white' : 'text-vicky-primary/60'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-vicky-accent text-white' : 'text-vicky-primary/60'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 md:space-x-3 bg-vicky-accent text-white px-3 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-bold font-outfit hover:bg-vicky-primary transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Add Gallery Item</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-vicky-primary/40" />
        <input
          type="text"
          placeholder="Search gallery items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 md:pl-12 pr-4 py-2 md:py-3 border-2 border-vicky-primary/20 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none font-outfit text-sm md:text-base"
        />
      </div>

      {/* Edit/Create Form */}
      {(editingItem || isCreating) && (
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-8 border border-vicky-primary/10">
          <h4 className="text-lg md:text-2xl font-bold text-vicky-primary font-outfit mb-4 md:mb-6">
            {editingItem ? 'Edit Gallery Item' : 'Create New Gallery Item'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm md:text-lg font-medium text-vicky-primary mb-2 md:mb-3 font-outfit">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-vicky-primary/20 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none font-outfit text-sm md:text-base"
                placeholder="e.g., Bridal Elegance"
              />
            </div>
            
            <div>
              <label className="block text-sm md:text-lg font-medium text-vicky-primary mb-2 md:mb-3 font-outfit">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-vicky-primary/20 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none font-outfit text-sm md:text-base"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm md:text-lg font-medium text-vicky-primary mb-2 md:mb-3 font-outfit">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-vicky-primary/20 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none font-outfit resize-none text-sm md:text-base"
                placeholder="Describe this gallery item..."
              />
            </div>

            <div>
              <label className="block text-sm md:text-lg font-medium text-vicky-primary mb-2 md:mb-3 font-outfit">Main Image</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="flex-1 w-full px-3 md:px-4 py-2 md:py-3 border-2 border-vicky-primary/20 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none font-outfit text-sm md:text-base"
                  placeholder="Image URL"
                />
                <label className="flex items-center justify-center space-x-2 bg-vicky-accent text-white px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl font-bold font-outfit hover:bg-vicky-primary transition-all cursor-pointer text-sm md:text-base">
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'main')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm md:text-lg font-medium text-vicky-primary mb-2 md:mb-3 font-outfit">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-vicky-primary/20 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-vicky-accent focus:border-transparent outline-none font-outfit text-sm md:text-base"
                placeholder="0"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-5 h-5 text-vicky-accent border-2 border-vicky-primary/20 rounded focus:ring-vicky-accent"
                />
                <span className="text-sm md:text-lg font-medium text-vicky-primary font-outfit">Featured Item</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6 md:mt-8">
            <button
              onClick={handleCancel}
              className="px-4 md:px-6 py-2 md:py-3 border-2 border-vicky-primary/20 text-vicky-primary rounded-xl md:rounded-2xl font-bold font-outfit hover:bg-vicky-primary/10 transition-all duration-300 text-sm md:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 md:px-6 py-2 md:py-3 bg-vicky-accent text-white rounded-xl md:rounded-2xl font-bold font-outfit hover:bg-vicky-primary transition-all duration-300 flex items-center justify-center space-x-2 text-sm md:text-base"
            >
              <Save className="w-4 h-4 md:w-5 md:h-5" />
              <span>Save Item</span>
            </button>
          </div>
        </div>
      )}

      {/* Gallery Items Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl md:rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-vicky-primary/10">
              <div className="aspect-video bg-gray-200 relative">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-8 h-8 md:w-12 md:h-12" />
                  </div>
                )}
                {item.is_featured && (
                  <div className="absolute top-2 right-2 bg-vicky-accent text-white px-2 py-1 rounded-full text-xs font-bold font-outfit">
                    Featured
                  </div>
                )}
              </div>
              
              <div className="p-3 md:p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm md:text-lg font-bold text-vicky-primary font-outfit line-clamp-1">{item.title}</h4>
                  <span className="text-xs bg-vicky-accent/10 text-vicky-accent px-2 py-1 rounded-full font-outfit">
                    {item.category}
                  </span>
                </div>
                
                <p className="text-xs md:text-sm text-vicky-primary/70 font-outfit mb-3 md:mb-4 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-vicky-primary/60 font-outfit">
                  <span>Order: {item.sort_order}</span>
                  <span>Likes: {item.likes}</span>
                </div>

                <div className="flex items-center space-x-2 mt-3 md:mt-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 flex items-center justify-center space-x-1 md:space-x-2 bg-vicky-accent text-white px-2 md:px-3 py-2 rounded-lg md:rounded-xl font-bold font-outfit hover:bg-vicky-primary transition-all text-xs md:text-sm"
                  >
                    <Edit className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={() => toggleFeatured(item.id!, item.is_featured)}
                    className="flex items-center justify-center bg-vicky-accent/10 text-vicky-accent px-2 md:px-3 py-2 rounded-lg md:rounded-xl hover:bg-vicky-accent/20 transition-all"
                  >
                    {item.is_featured ? <EyeOff className="w-3 h-3 md:w-4 md:h-4" /> : <Eye className="w-3 h-3 md:w-4 md:h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id!, item.title)}
                    className="flex items-center justify-center bg-red-100 text-red-600 px-2 md:px-3 py-2 rounded-lg md:rounded-xl hover:bg-red-200 transition-all"
                  >
                    <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl md:rounded-3xl shadow-xl border border-vicky-primary/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-vicky-bg">
                <tr>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-vicky-primary font-outfit">Image</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-vicky-primary font-outfit">Title</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-vicky-primary font-outfit">Category</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-vicky-primary font-outfit">Featured</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-vicky-primary font-outfit">Order</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-vicky-primary font-outfit">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={item.id} className="border-t border-vicky-primary/10 hover:bg-vicky-bg/50 transition-colors">
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-lg overflow-hidden">
                        {item.image_url ? (
                          <img 
                            src={item.image_url} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageIcon className="w-4 h-4 md:w-6 md:h-6" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div>
                        <h4 className="text-sm md:text-base font-bold text-vicky-primary font-outfit line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-vicky-primary/60 font-outfit line-clamp-1">{item.description}</p>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span className="text-xs bg-vicky-accent/10 text-vicky-accent px-2 py-1 rounded-full font-outfit">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <button
                        onClick={() => toggleFeatured(item.id!, item.is_featured)}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-outfit ${
                          item.is_featured 
                            ? 'bg-vicky-accent text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {item.is_featured ? <Star className="w-3 h-3" /> : <div className="w-3 h-3" />}
                        <span>{item.is_featured ? 'Featured' : 'Normal'}</span>
                      </button>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => moveItem(item.id!, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-vicky-accent/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MoveUp className="w-3 h-3 md:w-4 md:h-4 text-vicky-primary" />
                        </button>
                        <span className="text-xs md:text-sm font-outfit text-vicky-primary">{item.sort_order}</span>
                        <button
                          onClick={() => moveItem(item.id!, 'down')}
                          disabled={index === filteredItems.length - 1}
                          className="p-1 rounded hover:bg-vicky-accent/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MoveDown className="w-3 h-3 md:w-4 md:h-4 text-vicky-primary" />
                        </button>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 md:p-2 bg-vicky-accent text-white rounded-lg hover:bg-vicky-primary transition-all"
                        >
                          <Edit className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id!, item.title)}
                          className="p-1.5 md:p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                        >
                          <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <ImageIcon className="w-12 h-12 md:w-16 md:h-16 text-vicky-primary/20 mx-auto mb-4" />
          <h3 className="text-lg md:text-xl font-bold text-vicky-primary font-outfit mb-2">No Gallery Items Found</h3>
          <p className="text-sm md:text-base text-vicky-primary/60 font-outfit">
            {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding your first gallery item.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
