import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSave, FaArrowLeft, FaPlus, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import '../../styles/Dashboard.css';

function PortfolioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [projectTypes, setProjectTypes] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client: '',
    projectType: '',
    technologies: [],
    featuredImage: '',
    images: [],
    websiteUrl: '',
    completionDate: '',
    status: 'published',
    isFeatured: false
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [newTechnology, setNewTechnology] = useState('');
  const [newImage, setNewImage] = useState('');

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

    // Fetch project types
    fetchProjectTypes();

    // If id exists, fetch portfolio data for editing
    if (id) {
      setIsEditing(true);
      fetchPortfolioData(id);
    }
  }, [id, navigate]);

  const fetchProjectTypes = async () => {
    try {
      const response = await axios.get('/api/portfolio/project-types');
      setProjectTypes(response.data);
    } catch (error) {
      console.error('Error fetching project types:', error);
    }
  };

  const fetchPortfolioData = async (portfolioId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/portfolio/${portfolioId}`);
      const portfolioData = response.data;
      
      setFormData({
        title: portfolioData.title,
        description: portfolioData.description,
        client: portfolioData.client,
        projectType: portfolioData.projectType,
        technologies: portfolioData.technologies || [],
        featuredImage: portfolioData.featuredImage,
        images: portfolioData.images || [],
        websiteUrl: portfolioData.websiteUrl || '',
        completionDate: portfolioData.completionDate ? new Date(portfolioData.completionDate).toISOString().split('T')[0] : '',
        status: portfolioData.status,
        isFeatured: portfolioData.isFeatured
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      setLoading(false);
      navigate('/dashboard/portfolio');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddTechnology = () => {
    if (newTechnology.trim() !== '' && !formData.technologies.includes(newTechnology.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, newTechnology.trim()]
      });
      setNewTechnology('');
    }
  };

  const handleRemoveTechnology = (tech) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    });
  };

  const handleAddImage = () => {
    if (newImage.trim() !== '' && !formData.images.includes(newImage.trim())) {
      setFormData({
        ...formData,
        images: [...formData.images, newImage.trim()]
      });
      setNewImage('');
    }
  };

  const handleRemoveImage = (image) => {
    setFormData({
      ...formData,
      images: formData.images.filter(img => img !== image)
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.client.trim()) {
      newErrors.client = 'Client name is required';
    }
    
    if (!formData.projectType.trim()) {
      newErrors.projectType = 'Project type is required';
    }
    
    if (!formData.featuredImage.trim()) {
      newErrors.featuredImage = 'Featured image URL is required';
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
      
      if (isEditing) {
        // Update existing portfolio
        await axios.put(`/api/portfolio/${id}`, formData);
      } else {
        // Create new portfolio
        await axios.post('/api/portfolio', formData);
      }
      
      setLoading(false);
      navigate('/dashboard/portfolio');
    } catch (error) {
      console.error('Error saving portfolio:', error);
      setLoading(false);
      alert('Failed to save portfolio item');
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
          <h2>{isEditing ? 'Edit Portfolio Item' : 'Create Portfolio Item'}</h2>
          <button 
            className="btn-secondary" 
            onClick={() => navigate('/dashboard/portfolio')}
          >
            <FaArrowLeft /> Back to Portfolio
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
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className={errors.description ? 'error' : ''}
              ></textarea>
              {errors.description && <div className="error-message">{errors.description}</div>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="client">Client</label>
                <input
                  type="text"
                  id="client"
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  className={errors.client ? 'error' : ''}
                />
                {errors.client && <div className="error-message">{errors.client}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="projectType">Project Type</label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className={errors.projectType ? 'error' : ''}
                >
                  <option value="">Select Project Type</option>
                  {projectTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                  <option value="new">+ Add New Project Type</option>
                </select>
                {errors.projectType && <div className="error-message">{errors.projectType}</div>}
                {formData.projectType === 'new' && (
                  <input
                    type="text"
                    placeholder="Enter new project type"
                    className="new-category-input"
                    onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                  />
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="technologies">Technologies</label>
              <div className="input-with-button">
                <input
                  type="text"
                  id="technologies"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  placeholder="Add technology"
                />
                <button 
                  type="button" 
                  onClick={handleAddTechnology}
                  className="btn-add"
                >
                  <FaPlus />
                </button>
              </div>
              <div className="tags-container">
                {formData.technologies.map((tech, index) => (
                  <div key={index} className="tag">
                    {tech}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTechnology(tech)}
                      className="btn-remove-tag"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
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
            
            <div className="form-group">
              <label htmlFor="images">Additional Images</label>
              <div className="input-with-button">
                <input
                  type="text"
                  id="images"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Add image URL"
                />
                <button 
                  type="button" 
                  onClick={handleAddImage}
                  className="btn-add"
                >
                  <FaPlus />
                </button>
              </div>
              <div className="images-grid">
                {formData.images.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image} alt={`Portfolio ${index}`} />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveImage(image)}
                      className="btn-remove-image"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="websiteUrl">Website URL</label>
                <input
                  type="text"
                  id="websiteUrl"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="completionDate">Completion Date</label>
                <input
                  type="date"
                  id="completionDate"
                  name="completionDate"
                  value={formData.completionDate}
                  onChange={handleChange}
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
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                  />
                  Feature on Homepage
                </label>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                <FaSave /> {isEditing ? 'Update Project' : 'Save Project'}
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => navigate('/dashboard/portfolio')}
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

export default PortfolioForm;