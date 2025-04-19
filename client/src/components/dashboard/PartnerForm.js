import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSave, FaArrowLeft, FaUpload, FaTimes, FaLink } from 'react-icons/fa';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import '../../styles/Dashboard.css';
import '../../styles/DashboardComponents.css';

function PartnerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    description: '',
    isActive: true,
    order: 0
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
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

    // If id exists, fetch partner data for editing
    if (id) {
      setIsEditing(true);
      fetchPartnerData(id);
    }
  }, [id, navigate]);

  const fetchPartnerData = async (partnerId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/partners/${partnerId}`);
      const partnerData = response.data;
      
      setFormData({
        name: partnerData.name,
        website: partnerData.website || '',
        description: partnerData.description || '',
        isActive: partnerData.isActive,
        order: partnerData.order
      });
      
      // Set logo preview for existing image
      if (partnerData.logo) {
        setLogoPreview(partnerData.logo);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching partner data:', error);
      setLoading(false);
      navigate('/dashboard/partners');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please choose a smaller file.');
        e.target.value = '';
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Only JPEG, JPG, PNG, GIF, WebP, and SVG are allowed.');
        e.target.value = '';
        return;
      }
      
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      
      // Clear any previous error
      if (errors.logo) {
        setErrors(prev => ({ ...prev, logo: null }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Add null/undefined checks before calling trim()
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Partner name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Partner name must be at least 2 characters long';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Partner name cannot exceed 100 characters';
    }
    
    // Website validation (optional field)
    if (formData.website && formData.website.trim()) {
      try {
        new URL(formData.website);
      } catch (e) {
        newErrors.website = 'Please enter a valid URL (e.g., https://example.com)';
      }
    }
    
    // Only require logo for new partners, not for edits
    if (!isEditing && !logoFile) {
      newErrors.logo = 'Partner logo is required';
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
      
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('website', formData.website || '');
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('isActive', formData.isActive);
      
      // Only append file if a new one is selected
      if (logoFile) {
        formDataToSend.append('logo', logoFile);
      }
      
      let response;
      
      if (isEditing) {
        // Update existing partner
        response = await axios.put(`/api/partners/${id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Update response:', response.data);
      } else {
        // Create new partner
        response = await axios.post('/api/partners', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Create response:', response.data);
      }
      
      setLoading(false);
      navigate('/dashboard/partners');
    } catch (error) {
      console.error('Error saving partner:', error);
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
          alert(`Failed to save partner: ${error.response.data.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        alert('Failed to save partner: No response from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        alert(`Failed to save partner: ${error.message}`);
      }
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <DashboardHeader />
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <DashboardHeader />
        
        <div className="content-header">
          <h2>{isEditing ? 'Edit Partner' : 'Add New Partner'}</h2>
          <button 
            className="btn-secondary" 
            onClick={() => navigate('/dashboard/partners')}
          >
            <FaArrowLeft /> Back to Partners
          </button>
        </div>
        
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Partner Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                placeholder="Enter partner name"
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="website">
                <FaLink className="form-icon" /> Website URL (Optional)
              </label>
              <input
                type="text"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className={errors.website ? 'error' : ''}
                placeholder="https://example.com"
              />
              {errors.website && <div className="error-message">{errors.website}</div>}
              <div className="form-hint">Enter the partner's website URL if available</div>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Brief description about the partner"
              ></textarea>
              <div className="form-hint">A short description about the partner or the partnership</div>
            </div>
            
            <div className="form-group">
              <label htmlFor="logo">Partner Logo</label>
              <div className="file-upload-container">
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  onChange={handleLogoChange}
                  accept="image/*"
                  className={errors.logo ? 'error' : ''}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
                <button 
                  type="button" 
                  className="btn-upload" 
                  onClick={() => fileInputRef.current.click()}
                >
                  <FaUpload /> Choose Logo
                </button>
                <span className="file-name">
                  {logoFile ? logoFile.name : logoPreview ? 'Current logo' : 'No file chosen'}
                </span>
              </div>
              {errors.logo && <div className="error-message">{errors.logo}</div>}
              <div className="form-hint">Recommended size: 200x100 pixels. Max size: 2MB. Transparent PNG or SVG recommended.</div>
              {logoPreview && (
                <div className="image-preview logo-preview">
                  <img src={logoPreview} alt="Logo Preview" />
                  <button 
                    type="button" 
                    className="btn-remove-image" 
                    onClick={() => {
                      setLogoFile(null);
                      setLogoPreview('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>
            
            <div className="form-group checkbox-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <span className="checkbox-label">Active</span>
              </label>
              <div className="form-hint">
                Active partners will be displayed on the website. Inactive partners will be hidden.
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                <FaSave /> {isEditing ? 'Update Partner' : 'Save Partner'}
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => navigate('/dashboard/partners')}
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

export default PartnerForm;