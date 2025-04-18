import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSave, FaArrowLeft, FaPlus, FaTimes, FaUpload, FaLink, FaCalendarAlt, FaUser, FaFolder, FaCode, FaGlobe } from 'react-icons/fa';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import '../../styles/Dashboard.css';
import '../../styles/PortfolioForm.css';

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
    websiteUrl: '',
    completionDate: '',
    status: 'published',
    isFeatured: false
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [newTechnology, setNewTechnology] = useState('');
  const [showProjectTypeModal, setShowProjectTypeModal] = useState(false);
  const [newProjectType, setNewProjectType] = useState('');
  
  // File upload states
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState('');
  const [additionalImages, setAdditionalImages] = useState([]);
  const featuredImageInputRef = useRef(null);
  const additionalImageInputRef = useRef(null);

  // Define fetchPortfolioData before using it in useEffect
  const fetchPortfolioData = useCallback(async (portfolioId) => {
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
        websiteUrl: portfolioData.websiteUrl || '',
        completionDate: portfolioData.completionDate ? new Date(portfolioData.completionDate).toISOString().split('T')[0] : '',
        status: portfolioData.status,
        isFeatured: portfolioData.isFeatured
      });
      
      // Set image preview for existing image
      if (portfolioData.featuredImage) {
        setFeaturedImagePreview(portfolioData.featuredImage);
      }
      
      // Set additional images
      if (portfolioData.images && portfolioData.images.length > 0) {
        setAdditionalImages(portfolioData.images.map(img => ({
          preview: img,
          file: null
        })));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      setLoading(false);
      navigate('/dashboard/portfolio');
    }
  }, [navigate]);

  const fetchProjectTypes = async () => {
    try {
      const response = await axios.get('/api/portfolio/project-types');
      setProjectTypes(response.data);
    } catch (error) {
      console.error('Error fetching project types:', error);
    }
  };
  
  const handleAddProjectType = () => {
    if (newProjectType.trim()) {
      // Add the new project type to the list
      setProjectTypes([...projectTypes, newProjectType.trim()]);
      // Set it as the selected project type
      setFormData({
        ...formData,
        projectType: newProjectType.trim()
      });
      // Reset and close modal
      setNewProjectType('');
      setShowProjectTypeModal(false);
    }
  };

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
  }, [id, navigate, fetchPortfolioData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleProjectTypeChange = (e) => {
    const value = e.target.value;
    if (value === 'add-new') {
      setShowProjectTypeModal(true);
    } else {
      setFormData({
        ...formData,
        projectType: value
      });
    }
  };
  
  const handleFeaturedImageChange = (e) => {
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
      
      setFeaturedImageFile(file);
      setFeaturedImagePreview(URL.createObjectURL(file));
      
      // Clear any previous error
      if (errors.featuredImage) {
        setErrors(prev => ({ ...prev, featuredImage: null }));
      }
    }
  };
  
  const handleAdditionalImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate each file
    for (const file of files) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 5MB limit. Please choose smaller files.`);
        e.target.value = '';
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} has invalid type. Only JPEG, JPG, PNG, GIF, and WebP are allowed.`);
        e.target.value = '';
        return;
      }
    }
    
    // Add new images to the list
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setAdditionalImages([...additionalImages, ...newImages]);
    e.target.value = ''; // Reset input
  };
  
  const handleRemoveAdditionalImage = (index) => {
    const updatedImages = [...additionalImages];
    // Revoke object URL to avoid memory leaks
    if (updatedImages[index].preview && !updatedImages[index].file) {
      URL.revokeObjectURL(updatedImages[index].preview);
    }
    updatedImages.splice(index, 1);
    setAdditionalImages(updatedImages);
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

  const validateForm = () => {
    const newErrors = {};
    
    // Add null/undefined checks before calling trim()
    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }
    
    if (!formData.description || !formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters long';
    }
    
    if (!formData.client || !formData.client.trim()) {
      newErrors.client = 'Client name is required';
    }
    
    if (!formData.projectType || !formData.projectType.trim()) {
      newErrors.projectType = 'Project type is required';
    }
    
    // Only require image for new projects, not for edits
    if (!isEditing && !featuredImageFile) {
      newErrors.featuredImage = 'Featured image is required';
    }
    
    // Validate technologies (max 10)
    if (formData.technologies && formData.technologies.length > 10) {
      newErrors.technologies = 'Maximum 10 technologies allowed';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Log form data for debugging
    console.log('Form data before validation:', {
      title: formData.title,
      description: formData.description,
      client: formData.client,
      projectType: formData.projectType,
      technologies: formData.technologies,
      websiteUrl: formData.websiteUrl,
      completionDate: formData.completionDate,
      status: formData.status,
      isFeatured: formData.isFeatured
    });
    
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
      
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title || '');
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('client', formData.client || '');
      formDataToSend.append('projectType', formData.projectType || '');
      formDataToSend.append('technologies', JSON.stringify(formData.technologies || []));
      formDataToSend.append('websiteUrl', formData.websiteUrl || '');
      formDataToSend.append('completionDate', formData.completionDate || '');
      formDataToSend.append('status', formData.status || 'draft');
      formDataToSend.append('isFeatured', formData.isFeatured || false);
      
      // Only append file if a new one is selected
      if (featuredImageFile) {
        formDataToSend.append('featuredImage', featuredImageFile); // Changed from 'image' to match the multer field name
      }
      
      // For additional images, we need to handle them separately since the multer middleware
      // only supports a single file upload. We'll need to modify the server to handle multiple files
      // or implement a different approach for additional images.
      
      // For now, we'll send the additional images as URLs in the request body
      const imageUrls = additionalImages
        .filter(img => !img.file) // Only include existing URLs
        .map(img => img.preview);
      
      formDataToSend.append('images', JSON.stringify(imageUrls));
      
      console.log('Submitting form data:', {
        title: formData.title,
        description: formData.description.substring(0, 30) + '...',
        client: formData.client,
        projectType: formData.projectType,
        technologies: formData.technologies,
        websiteUrl: formData.websiteUrl,
        completionDate: formData.completionDate,
        status: formData.status,
        isFeatured: formData.isFeatured,
        featuredImageFile: featuredImageFile ? featuredImageFile.name : 'None',
        imageUrls: imageUrls.length
      });
      
      let response;
      
      if (isEditing) {
        // Update existing portfolio
        response = await axios.put(`/api/portfolio/${id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Update response:', response.data);
      } else {
        // Create new portfolio
        response = await axios.post('/api/portfolio', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Create response:', response.data);
      }
      
      setLoading(false);
      navigate('/dashboard/portfolio');
    } catch (error) {
      console.error('Error saving portfolio:', error);
      setLoading(false);
      
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
          const errorMessage = error.response.data.message || 'Server Error';
          console.error(`Failed to save portfolio: ${errorMessage}`);
          alert(`Failed to save portfolio: ${errorMessage}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        alert('Failed to save portfolio: No response from server. Please check your network connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        alert(`Failed to save portfolio: ${error.message}`);
      }
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
              <label htmlFor="title">Project Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'error' : ''}
                placeholder="Enter project title (min 5 characters)"
              />
              {errors.title && <div className="error-message">{errors.title}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Project Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className={errors.description ? 'error' : ''}
                placeholder="Enter project description (min 20 characters)"
              ></textarea>
              {errors.description && <div className="error-message">{errors.description}</div>}
              <div className="form-hint">Provide a detailed description of the project, including its goals, challenges, and solutions.</div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="client">
                  <FaUser className="form-icon" /> Client
                </label>
                <input
                  type="text"
                  id="client"
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  className={errors.client ? 'error' : ''}
                  placeholder="Enter client name"
                />
                {errors.client && <div className="error-message">{errors.client}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="projectType">
                  <FaFolder className="form-icon" /> Project Type
                </label>
                <div className="select-with-button">
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleProjectTypeChange}
                    className={errors.projectType ? 'error' : ''}
                  >
                    <option value="">Select Project Type</option>
                    {projectTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                    <option value="add-new">+ Add New Project Type</option>
                  </select>
                </div>
                {errors.projectType && <div className="error-message">{errors.projectType}</div>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="technologies">
                <FaCode className="form-icon" /> Technologies
              </label>
              <div className="input-with-button">
                <input
                  type="text"
                  id="technologies"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  placeholder="Add technology (e.g., React, Node.js, MongoDB)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                />
                <button 
                  type="button" 
                  onClick={handleAddTechnology}
                  className="btn-add"
                  title="Add Technology"
                >
                  <FaPlus />
                </button>
              </div>
              {errors.technologies && <div className="error-message">{errors.technologies}</div>}
              <div className="form-hint">Maximum 10 technologies allowed. Press Enter or click the + button to add.</div>
              <div className="tags-container">
                {formData.technologies.map((tech, index) => (
                  <div key={index} className="tag">
                    {tech}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTechnology(tech)}
                      className="btn-remove-tag"
                      title="Remove Technology"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="featuredImage">Featured Image</label>
              <div className="file-upload-container">
                <input
                  type="file"
                  id="featuredImage"
                  name="featuredImage"
                  onChange={handleFeaturedImageChange}
                  accept="image/*"
                  className={errors.featuredImage ? 'error' : ''}
                  ref={featuredImageInputRef}
                  style={{ display: 'none' }}
                />
                <button 
                  type="button" 
                  className="btn-upload" 
                  onClick={() => featuredImageInputRef.current.click()}
                  title="Upload Featured Image"
                >
                  <FaUpload /> Choose Image
                </button>
                <span className="file-name">
                  {featuredImageFile ? featuredImageFile.name : featuredImagePreview ? 'Current image' : 'No file chosen'}
                </span>
              </div>
              {errors.featuredImage && <div className="error-message">{errors.featuredImage}</div>}
              <div className="form-hint">This image will be displayed as the main image for this project. Max size: 5MB.</div>
              {featuredImagePreview && (
                <div className="image-preview">
                  <img src={featuredImagePreview} alt="Preview" />
                  <button 
                    type="button" 
                    className="btn-remove-image" 
                    onClick={() => {
                      setFeaturedImageFile(null);
                      setFeaturedImagePreview('');
                      if (featuredImageInputRef.current) featuredImageInputRef.current.value = '';
                    }}
                    title="Remove Image"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="additionalImages">Additional Images</label>
              <div className="file-upload-container">
                <input
                  type="file"
                  id="additionalImages"
                  name="additionalImages"
                  onChange={handleAdditionalImageChange}
                  accept="image/*"
                  multiple
                  ref={additionalImageInputRef}
                  style={{ display: 'none' }}
                />
                <button 
                  type="button" 
                  className="btn-upload" 
                  onClick={() => additionalImageInputRef.current.click()}
                  title="Upload Additional Images"
                >
                  <FaUpload /> Choose Images
                </button>
                <span className="file-name">
                  {additionalImages.length > 0 ? `${additionalImages.length} image(s) selected` : 'No files chosen'}
                </span>
              </div>
              <div className="form-hint">You can select multiple images at once. These images will be displayed in the project gallery. Max size per image: 5MB.</div>
              {additionalImages.length > 0 && (
                <div className="images-grid">
                  {additionalImages.map((image, index) => (
                    <div key={index} className="image-item">
                      <img src={image.preview} alt={`Portfolio ${index}`} />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveAdditionalImage(index)}
                        className="btn-remove-image"
                        title="Remove Image"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="websiteUrl">
                  <FaGlobe className="form-icon" /> Website URL
                </label>
                <input
                  type="text"
                  id="websiteUrl"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
                <div className="form-hint">Enter the live URL of the project if available</div>
              </div>
              
              <div className="form-group">
                <label htmlFor="completionDate">
                  <FaCalendarAlt className="form-icon" /> Completion Date
                </label>
                <input
                  type="date"
                  id="completionDate"
                  name="completionDate"
                  value={formData.completionDate}
                  onChange={handleChange}
                />
                <div className="form-hint">When was the project completed?</div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Publication Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <div className="form-hint">Draft projects won't be visible to visitors</div>
              </div>
              
              <div className="form-group checkbox-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                  />
                  <span className="checkbox-label">Feature on Homepage</span>
                </label>
                <div className="form-hint">
                  Featured projects will be displayed prominently on the homepage in the featured section.
                </div>
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

      {/* Modal for adding new project type */}
      {showProjectTypeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Project Type</h3>
            <div className="form-group">
              <label htmlFor="newProjectType">Project Type Name</label>
              <input
                type="text"
                id="newProjectType"
                value={newProjectType}
                onChange={(e) => setNewProjectType(e.target.value)}
                placeholder="Enter project type name"
                autoFocus
              />
              <div className="form-hint">Examples: Web Development, Mobile App, UI/UX Design, Branding</div>
            </div>
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-primary"
                onClick={handleAddProjectType}
              >
                <FaPlus /> Add Project Type
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setShowProjectTypeModal(false)}
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

export default PortfolioForm;