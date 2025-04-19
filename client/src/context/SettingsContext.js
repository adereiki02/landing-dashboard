import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the context
const SettingsContext = createContext();

// Create a provider component
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    siteName: 'ReikiDevs',
    siteDescription: 'Web Development and Digital Solutions',
    logo: '/images/reikidevs-logo.png',
    favicon: '/favicon.ico',
    contactEmail: 'info@reikidevs.com',
    contactPhone: '+62 812 3456 7890',
    address: 'Jakarta, Indonesia',
    socialMedia: {
      facebook: 'https://facebook.com/reikidevs',
      twitter: 'https://twitter.com/reikidevs',
      instagram: 'https://instagram.com/reikidevs',
      linkedin: 'https://linkedin.com/company/reikidevs',
      youtube: 'https://youtube.com/reikidevs'
    },
    metaTags: 'web development, digital agency, mobile app, website, SEO, digital marketing',
    googleAnalyticsId: '',
    customCss: '',
    customJs: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch settings from API
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/settings');
      
      // Initialize socialMedia if it doesn't exist
      const fetchedSettings = response.data;
      if (!fetchedSettings.socialMedia) {
        fetchedSettings.socialMedia = {
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: '',
          youtube: ''
        };
      }
      
      // Ensure favicon has proper path
      if (fetchedSettings.favicon && !fetchedSettings.favicon.startsWith('data:') && !fetchedSettings.favicon.startsWith('/')) {
        fetchedSettings.favicon = `/${fetchedSettings.favicon}`;
      }
      
      setSettings(fetchedSettings);
      console.log('Settings loaded:', fetchedSettings);
      
      // Update favicon in the browser
      if (fetchedSettings.favicon) {
        const link = document.querySelector('link[rel="icon"]');
        if (link) {
          link.href = fetchedSettings.favicon;
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  // Update settings
  const updateSettings = async (newSettings, saveToAPI = false) => {
    // Always update local state immediately
    setSettings(newSettings);
    
    // If saveToAPI is true, also send to the server
    if (saveToAPI) {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.put('/api/settings', newSettings);
        setSettings(response.data);
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Error updating settings:', error);
        setError('Failed to update settings');
        return { success: false, error };
      } finally {
        setLoading(false);
      }
    }
    
    // For local updates only, return success
    return { success: true, data: newSettings };
  };

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, error, fetchSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use the settings context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;