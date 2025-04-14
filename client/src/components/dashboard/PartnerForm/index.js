import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import Sidebar from '../Sidebar';
import DashboardHeader from '../DashboardHeader';
import './PartnerForm.css';

function PartnerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    websiteUrl: '',
    isActive: true,
    logo: null
  });
  
  const [logoPreview, setLogoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  
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
    
    // If in edit mode, fetch the partner data
    if (isEditMode) {
      fetchPartnerData();
    }
  }, [isEditMode, id, navigate]);
  
  const fetchPartnerData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/partners/${id}`);
      const partner = response.data;
      
      setFormData({
        name: partner.name,
        websiteUrl: partner.websiteUrl || '',
        isActive: partner.isActive
      });
      
      setLogoPreview(partner.logo);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching partner data:', error);
      setError('Failed to load partner data. Please try again.');
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('websiteUrl', formData.websiteUrl);
      formDataToSend.append('isActive', formData.isActive);
      
      if (logoFile) {
        formDataToSend.append('logo', logoFile);
      }
      
      if (isEditMode) {
        await axios.put(`/api/partners/${id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post('/api/partners', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      navigate('/dashboard/partners');
    } catch (error) {
      console.error('Error saving partner:', error);
      setError(error.response?.data?.message || 'Failed to save partner. Please try again.');
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) {
    return <div className="loading">Loading...</div>;
  }
  
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <DashboardHeader />
        
        <div className="content-header">
          <h2>{isEditMode ? 'Edit Partner' : 'Add New Partner'}</h2>
          <button 
            className="btn-secondary" 
            onClick={() => navigate('/dashboard/partners')}
          >
            <FaArrowLeft /> Back to Partners
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Partner Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter partner name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="websiteUrl">Website URL</label>
              <input
                type="url"
                id="websiteUrl"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>
            
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                Active
              </label>
            </div>
            
            <div className="form-group">
              <label htmlFor="logo">Partner Logo {!isEditMode && '*'}</label>
              <input
                type="file"
                id="logo"
                name="logo"
                onChange={handleLogoChange}
                accept="image/*"
                required={!isEditMode}
              />
              {logoPreview && (
                <div className="logo-preview">
                  <img src={logoPreview} alt="Logo Preview" />
                </div>
              )}
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => navigate('/dashboard/partners')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                <FaSave /> {loading ? 'Saving...' : 'Save Partner'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PartnerForm;