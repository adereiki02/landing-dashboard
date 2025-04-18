/**
 * Utility functions for handling URLs
 */
const config = require('../config/config');

/**
 * Ensures a URL has the full backend URL prefix if it's a relative path
 * @param {string} url - The URL to process
 * @returns {string} - The URL with backend prefix if needed
 */
const ensureFullUrl = (url) => {
  if (!url) return '';
  
  // If it's already an absolute URL, return it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a relative URL, add the backend URL
  return `${config.backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

/**
 * Processes an array of URLs to ensure they all have the full backend URL prefix
 * @param {Array<string>} urls - Array of URLs to process
 * @returns {Array<string>} - Array of URLs with backend prefix where needed
 */
const processUrlArray = (urls) => {
  if (!urls || !Array.isArray(urls)) return [];
  
  return urls.map(url => ensureFullUrl(url));
};

module.exports = {
  ensureFullUrl,
  processUrlArray
};