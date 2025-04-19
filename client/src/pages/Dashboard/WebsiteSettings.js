import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatusModal from '../../components/common/StatusModal';
import { FaSave, FaUpload, FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaCode } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';
import '../../styles/Dashboard.css';

function WebsiteSettings() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const { settings, updateSettings, fetchSettings } = useSettings();
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState('success');
  const [modalMessage, setModalMessage] = useState('');
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
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Create a copy of the current settings
    let updatedSettings = { ...settings };
    
    // Handle nested properties (like socialMedia.facebook)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      updatedSettings = {
        ...settings,
        [parent]: {
          ...settings[parent],
          [child]: value
        }
      };
    } else {
      updatedSettings = {
        ...settings,
        [name]: value
      };
    }
    
    // Update the settings in the context
    // We're not calling the API here, just updating the local state
    // The actual API update happens on form submit
    updateSettings(updatedSettings);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // Prepare settings for submission
      const settingsToSave = { ...settings };
      
      // Remove preview properties before sending to API
      delete settingsToSave.logoPreview;
      delete settingsToSave.faviconPreview;
      
      // Ensure socialMedia is properly formatted
      if (!settingsToSave.socialMedia) {
        settingsToSave.socialMedia = {
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: '',
          youtube: ''
        };
      }
      
      console.log('Saving settings...');
      
      // Save settings using the context
      const result = await updateSettings(settingsToSave, true);
      
      if (result.success) {
        setSuccess('Settings saved successfully!');
        setModalStatus('success');
        setModalMessage('Website settings have been saved successfully!');
        setModalOpen(true);
        
        // Refresh settings from the server
        await fetchSettings();
        
        // Force favicon update in the browser
        if (settingsToSave.favicon) {
          const link = document.querySelector('link[rel="icon"]');
          if (link) {
            link.href = settingsToSave.favicon;
          }
        }
      } else {
        setError('Failed to save settings. Please try again.');
        setModalStatus('error');
        setModalMessage('Failed to save website settings. Please try again.');
        setModalOpen(true);
      }
      
      // Reset file states
      setLogoFile(null);
      setFaviconFile(null);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings. Please try again.');
      setModalStatus('error');
      setModalMessage('An error occurred while saving settings: ' + (error.message || 'Unknown error'));
      setModalOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update the settings with the new logo
        const updatedSettings = {
          ...settings,
          logo: reader.result,
          logoPreview: URL.createObjectURL(file)
        };
        // Update the settings in the context
        updateSettings(updatedSettings);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFaviconFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update the settings with the new favicon
        const updatedSettings = {
          ...settings,
          favicon: reader.result, // Store as data URL
          faviconPreview: URL.createObjectURL(file)
        };
        // Update the settings in the context
        updateSettings(updatedSettings);
        
        // Force favicon update in the browser
        const link = document.querySelector('link[rel="icon"]');
        if (link) {
          link.href = reader.result;
        }
      };
      reader.readAsDataURL(file);
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
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          
          <div className="settings-section">
            <h3><FaGlobe /> General Settings</h3>
            <div className="form-group">
              <label htmlFor="siteName">Site Name</label>
              <input
                type="text"
                id="siteName"
                name="siteName"
                value={settings.siteName || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="siteDescription">Site Description</label>
              <input
                type="text"
                id="siteDescription"
                name="siteDescription"
                value={settings.siteDescription || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group logo-upload">
                <label>Logo</label>
                <div className="logo-preview">
                  <img src={settings.logoPreview || settings.logo || '/images/placeholder.png'} alt="Logo" />
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
                  <img src={settings.faviconPreview || settings.favicon || '/images/placeholder-favicon.png'} alt="Favicon" />
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
              <label htmlFor="contactEmail"><FaEnvelope /> Email Address</label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={settings.contactEmail || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contactPhone"><FaPhone /> Phone Number</label>
              <input
                type="text"
                id="contactPhone"
                name="contactPhone"
                value={settings.contactPhone || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address"><FaMapMarkerAlt /> Address</label>
              <textarea
                id="address"
                name="address"
                value={settings.address || ''}
                onChange={handleChange}
                rows="3"
              />
            </div>
          </div>
          
          <div className="settings-section">
            <h3>Social Media Links</h3>
            <div className="form-group">
              <label htmlFor="socialMedia.facebook"><FaFacebook /> Facebook URL</label>
              <input
                type="url"
                id="socialMedia.facebook"
                name="socialMedia.facebook"
                value={settings.socialMedia?.facebook || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="socialMedia.twitter"><FaTwitter /> Twitter URL</label>
              <input
                type="url"
                id="socialMedia.twitter"
                name="socialMedia.twitter"
                value={settings.socialMedia?.twitter || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="socialMedia.instagram"><FaInstagram /> Instagram URL</label>
              <input
                type="url"
                id="socialMedia.instagram"
                name="socialMedia.instagram"
                value={settings.socialMedia?.instagram || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="socialMedia.linkedin"><FaLinkedin /> LinkedIn URL</label>
              <input
                type="url"
                id="socialMedia.linkedin"
                name="socialMedia.linkedin"
                value={settings.socialMedia?.linkedin || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="socialMedia.youtube"><FaYoutube /> YouTube URL</label>
              <input
                type="url"
                id="socialMedia.youtube"
                name="socialMedia.youtube"
                value={settings.socialMedia?.youtube || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="settings-section">
            <h3>SEO & Additional Settings</h3>
            <div className="form-group">
              <label htmlFor="metaTags">Meta Tags</label>
              <textarea
                id="metaTags"
                name="metaTags"
                value={settings.metaTags || ''}
                onChange={handleChange}
                rows="3"
              />
              <small>Enter meta tags in JSON format or comma-separated keywords</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="googleAnalyticsId">Google Analytics ID</label>
              <input
                type="text"
                id="googleAnalyticsId"
                name="googleAnalyticsId"
                value={settings.googleAnalyticsId || ''}
                onChange={handleChange}
              />
              <small>Example: UA-XXXXX-Y or G-XXXXXXXX</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="customCss"><FaCode /> Custom CSS</label>
              <textarea
                id="customCss"
                name="customCss"
                value={settings.customCss || ''}
                onChange={handleChange}
                rows="5"
              />
              <small>Add custom CSS styles for your website</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="customJs"><FaCode /> Custom JavaScript</label>
              <textarea
                id="customJs"
                name="customJs"
                value={settings.customJs || ''}
                onChange={handleChange}
                rows="5"
              />
              <small>Add custom JavaScript for your website</small>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={saving}>
              <FaSave /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Status Modal */}
      <StatusModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        status={modalStatus}
        message={modalMessage}
        autoClose={true}
      />
    </div>
  );
}

export default WebsiteSettings;