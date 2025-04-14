import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import '../../styles/Dashboard.css';

function NewsForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    category: '',
    tags: '',
    status: 'draft',
    isHighlighted: false
  });
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
        excerpt: newsData.excerpt,
        featuredImage: newsData.featuredImage,
        category: newsData.category,
        tags: newsData.tags.join(', '),
        status: newsData.status,
        isHighlighted: newsData.isHighlighted
      });
      
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    } else if (formData.excerpt.length > 300) {
      newErrors.excerpt = 'Excerpt must be less than 300 characters';
    }
    
    if (!formData.featuredImage.trim()) {
      newErrors.featuredImage = 'Featured image URL is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Process tags from comma-separated string to array
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        : [];
      
      const newsData = {
        ...formData,
        tags: tagsArray
      };
      
      if (isEditing) {
        // Update existing news
        await axios.put(`/api/news/${id}`, newsData);
      } else {
        // Create new news
        await axios.post('/api/news', newsData);
      }
      
      setLoading(false);
      navigate('/dashboard/news');
    } catch (error) {
      console.error('Error saving news:', error);
      setLoading(false);
      alert('Failed to save news article');
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
              />
              {errors.title && <div className="error-message">{errors.title}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="excerpt">Excerpt (max 300 characters)</label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows="3"
                className={errors.excerpt ? 'error' : ''}
              ></textarea>
              {errors.excerpt && <div className="error-message">{errors.excerpt}</div>}
              <div className="char-count">{formData.excerpt.length}/300</div>
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
              ></textarea>
              {errors.content && <div className="error-message">{errors.content}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="featuredImage">Featured Image URL</label>
              <input
                type="text"
                id="featuredImage"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleChange}
                className={errors.featuredImage ? 'error' : ''}
              />
              {errors.featuredImage && <div className="error-message">{errors.featuredImage}</div>}
              {formData.featuredImage && (
                <div className="image-preview">
                  <img src={formData.featuredImage} alt="Preview" />
                </div>
              )}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="">Select Category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                  <option value="new">+ Add New Category</option>
                </select>
                {errors.category && <div className="error-message">{errors.category}</div>}
                {formData.category === 'new' && (
                  <input
                    type="text"
                    placeholder="Enter new category"
                    className="new-category-input"
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  />
                )}
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
                />
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
                <label>
                  <input
                    type="checkbox"
                    name="isHighlighted"
                    checked={formData.isHighlighted}
                    onChange={handleChange}
                  />
                  Highlight on Homepage
                </label>
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
    </div>
  );
}

export default NewsForm;