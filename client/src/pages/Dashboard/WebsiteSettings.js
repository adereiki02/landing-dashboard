import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { FaSave, FaUpload, FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import '../../styles/Dashboard.css';

function WebsiteSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    siteName: 'ReikiDevs',
    siteTagline: 'Professional Web Development Solutions',
    logoUrl: '/images/logo.png',
    faviconUrl: '/images/favicon.ico',
    email: 'info@reikidevs.com',
    phone: '+62 812 3456 7890',
    address: 'Jl. Teknologi No. 123, Jakarta, Indonesia',
    facebookUrl: 'https://facebook.com/reikidevs',
    twitterUrl: 'https://twitter.com/reikidevs',
    instagramUrl: 'https://instagram.com/reikidevs',
    linkedinUrl: 'https://linkedin.com/company/reikidevs',
    footerText: '© 2023 ReikiDevs. All rights reserved.',
    metaDescription: 'ReikiDevs provides professional web development services for businesses of all sizes.',
    metaKeywords: 'web development, mobile apps, software development, IT consulting',
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      
      // Check if user is admin or superadmin
      if (!parsedUser.role || (parsedUser.role !== 'admin' && parsedUser.role !== 'superadmin')) {
        navigate('/');
      }
    } else {
      navigate('/login');
    }
    
    // Simulate API call to fetch settings
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call to save settings
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved successfully!');
    }, 1500);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload the file to your server
      // For now, we'll just create a local URL
      const localUrl = URL.createObjectURL(file);
      setSettings(prev => ({
        ...prev,
        logoUrl: localUrl
      }));
    }
  };

  const handleFaviconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload the file to your server
      // For now, we'll just create a local URL
      const localUrl = URL.createObjectURL(file);
      setSettings(prev => ({
        ...prev,
        faviconUrl: localUrl
      }));
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
          <h2>Website Settings</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="settings-section">
            <h3><FaGlobe /> General Settings</h3>
            <div className="form-group">
              <label htmlFor="siteName">Site Name</label>
              <input
                type="text"
                id="siteName"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="siteTagline">Site Tagline</label>
              <input
                type="text"
                id="siteTagline"
                name="siteTagline"
                value={settings.siteTagline}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group logo-upload">
                <label>Logo</label>
                <div className="logo-preview">
                  <img src={settings.logoUrl} alt="Logo" />
                </div>
                <div className="upload-btn-wrapper">
                  <button className="btn-upload"><FaUpload /> Choose Logo</button>
                  <input type="file" name="logo" onChange={handleLogoUpload} accept="image/*" />
                </div>
                <small>Recommended size: 200x60 pixels</small>
              </div>
              
              <div className="form-group favicon-upload">
                <label>Favicon</label>
                <div className="favicon-preview">
                  <img src={settings.faviconUrl} alt="Favicon" />
                </div>
                <div className="upload-btn-wrapper">
                  <button className="btn-upload"><FaUpload /> Choose Favicon</button>
                  <input type="file" name="favicon" onChange={handleFaviconUpload} accept="image/x-icon,image/png" />
                </div>
                <small>Recommended size: 32x32 pixels</small>
              </div>
            </div>
          </div>
          
          <div className="settings-section">
            <h3><FaEnvelope /> Contact Information</h3>
            <div className="form-group">
              <label htmlFor="email"><FaEnvelope /> Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone"><FaPhone /> Phone Number</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address"><FaMapMarkerAlt /> Address</label>
              <textarea
                id="address"
                name="address"
                value={settings.address}
                onChange={handleChange}
                rows="3"
              />
            </div>
          </div>
          
          <div className="settings-section">
            <h3>Social Media Links</h3>
            <div className="form-group">
              <label htmlFor="facebookUrl"><FaFacebook /> Facebook URL</label>
              <input
                type="url"
                id="facebookUrl"
                name="facebookUrl"
                value={settings.facebookUrl}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="twitterUrl"><FaTwitter /> Twitter URL</label>
              <input
                type="url"
                id="twitterUrl"
                name="twitterUrl"
                value={settings.twitterUrl}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="instagramUrl"><FaInstagram /> Instagram URL</label>
              <input
                type="url"
                id="instagramUrl"
                name="instagramUrl"
                value={settings.instagramUrl}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="linkedinUrl"><FaLinkedin /> LinkedIn URL</label>
              <input
                type="url"
                id="linkedinUrl"
                name="linkedinUrl"
                value={settings.linkedinUrl}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="settings-section">
            <h3>Footer & SEO</h3>
            <div className="form-group">
              <label htmlFor="footerText">Footer Text</label>
              <input
                type="text"
                id="footerText"
                name="footerText"
                value={settings.footerText}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="metaDescription">Meta Description</label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                value={settings.metaDescription}
                onChange={handleChange}
                rows="3"
              />
              <small>Recommended length: 150-160 characters</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="metaKeywords">Meta Keywords</label>
              <input
                type="text"
                id="metaKeywords"
                name="metaKeywords"
                value={settings.metaKeywords}
                onChange={handleChange}
              />
              <small>Separate keywords with commas</small>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={saving}>
              <FaSave /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WebsiteSettings;