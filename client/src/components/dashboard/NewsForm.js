import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSave, FaArrowLeft, FaUpload, FaImage, FaTimes, FaPlus } from 'react-icons/fa';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import '../../styles/Dashboard.css';
import '../../styles/NewsForm.css';

function NewsForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    status: 'draft',
    isHighlighted: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Check if user is logged in and has admin privileges
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userInfo);
    if (!user.role || (user.role !== 'admin' && user.role !== 'superadmin')) {
      navigate('/');
      return;
    }

    // Fetch categories
    fetchCategories();

    // If id exists, fetch news data for editing
    if (id) {
      setIsEditing(true);
      fetchNewsData(id);
    }
  }, [id, navigate]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/news/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchNewsData = async (newsId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/news/${newsId}`);
      const newsData = response.data;
      
      setFormData({
        title: newsData.title,
        content: newsData.content,
        category: newsData.category,
        tags: newsData.tags.join(', '),
        status: newsData.status,
        isHighlighted: newsData.isHighlighted
      });
      
      // Set image preview for existing image
      if (newsData.featuredImage) {
        setImagePreview(newsData.featuredImage);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news data:', error);
      setLoading(false);
      navigate('/dashboard/news');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller file.');
        e.target.value = '';
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Only JPEG, JPG, PNG, GIF, and WebP are allowed.');
        e.target.value = '';
        return;
      }
      
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      
      // Clear any previous error
      if (errors.featuredImage) {
        setErrors(prev => ({ ...prev, featuredImage: null }));
      }
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      // Add the new category to the list
      setCategories([...categories, newCategory.trim()]);
      // Set it as the selected category
      setFormData({
        ...formData,
        category: newCategory.trim()
      });
      // Reset and close modal
      setNewCategory('');
      setShowCategoryModal(false);
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === 'add-new') {
      setShowCategoryModal(true);
    } else {
      setFormData({
        ...formData,
        category: value
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.trim().length < 20) {
      newErrors.content = 'Content must be at least 20 characters long';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    // Only require image for new articles, not for edits
    if (!isEditing && !imageFile) {
      newErrors.featuredImage = 'Featured image is required';
    }
    
    // Validate tags (max 5)
    if (formData.tags) {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      if (tagsArray.length > 5) {
        newErrors.tags = 'Maximum 5 tags allowed';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorElement = document.querySelector('.error-message');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    try {
      setLoading(true);
      
      // Process tags from comma-separated string to array
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        : [];
      
      // Limit to 5 tags
      if (tagsArray.length > 5) {
        setErrors(prev => ({ ...prev, tags: 'Maximum 5 tags allowed' }));
        setLoading(false);
        return;
      }
      
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('tags', JSON.stringify(tagsArray));
      formDataToSend.append('status', formData.status);
      formDataToSend.append('isHighlighted', formData.isHighlighted);
      
      // Only append file if a new one is selected
      if (imageFile) {
        formDataToSend.append('featuredImage', imageFile);
      }
      
      let response;
      
      if (isEditing) {
        // Update existing news
        response = await axios.put(`/api/news/${id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Update response:', response.data);
      } else {
        // Create new news
        response = await axios.post('/api/news', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Create response:', response.data);
      }
      
      setLoading(false);
      navigate('/dashboard/news');
    } catch (error) {
      console.error('Error saving news:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        
        // Handle validation errors from the server
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
          // Scroll to the first error
          setTimeout(() => {
            const firstErrorElement = document.querySelector('.error-message');
            if (firstErrorElement) {
              firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        } else {
          alert(`Failed to save news article: ${error.response.data.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        alert('Failed to save news article: No response from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        alert(`Failed to save news article: ${error.message}`);
      }
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <DashboardHeader />
        
        <div className="content-header">
          <h2>{isEditing ? 'Edit News Article' : 'Create News Article'}</h2>
          <button 
            className="btn-secondary" 
            onClick={() => navigate('/dashboard/news')}
          >
            <FaArrowLeft /> Back to News
          </button>
        </div>
        
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'error' : ''}
                placeholder="Enter news title (min 5 characters)"
              />
              {errors.title && <div className="error-message">{errors.title}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="10"
                className={errors.content ? 'error' : ''}
                placeholder="Enter news content (min 20 characters)"
              ></textarea>
              {errors.content && <div className="error-message">{errors.content}</div>}
              <div className="form-hint">The excerpt will be automatically generated from the content.</div>
            </div>
            
            <div className="form-group">
              <label htmlFor="featuredImage">Featured Image</label>
              <div className="file-upload-container">
                <input
                  type="file"
                  id="featuredImage"
                  name="featuredImage"
                  onChange={handleImageChange}
                  accept="image/*"
                  className={errors.featuredImage ? 'error' : ''}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
                <button 
                  type="button" 
                  className="btn-upload" 
                  onClick={() => fileInputRef.current.click()}
                >
                  <FaUpload /> Choose Image
                </button>
                <span className="file-name">
                  {imageFile ? imageFile.name : 'No file chosen'}
                </span>
              </div>
              {errors.featuredImage && <div className="error-message">{errors.featuredImage}</div>}
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button 
                    type="button" 
                    className="btn-remove-image" 
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <div className="select-with-button">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    className={errors.category ? 'error' : ''}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                    <option value="add-new">+ Add New Category</option>
                  </select>
                </div>
                {errors.category && <div className="error-message">{errors.category}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="tags">Tags (comma separated)</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="tag1, tag2, tag3"
                  className={errors.tags ? 'error' : ''}
                />
                {errors.tags && <div className="error-message">{errors.tags}</div>}
                <div className="form-hint">Maximum 5 tags allowed</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              
              <div className="form-group checkbox-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="isHighlighted"
                    checked={formData.isHighlighted}
                    onChange={handleChange}
                  />
                  <span className="checkbox-label">Highlight on Homepage</span>
                </label>
                <div className="form-hint">
                  Highlighted articles will be featured prominently on the homepage in the featured section.
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                <FaSave /> {isEditing ? 'Update Article' : 'Save Article'}
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => navigate('/dashboard/news')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal for adding new category */}
      {showCategoryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Category</h3>
            <div className="form-group">
              <label htmlFor="newCategory">Category Name</label>
              <input
                type="text"
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-primary"
                onClick={handleAddCategory}
              >
                <FaPlus /> Add Category
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setShowCategoryModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewsForm;