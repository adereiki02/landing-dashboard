/**
 * Utility functions for handling image URLs
 */

/**
 * Returns the appropriate image URL based on environment configuration
 * @param {string} imagePath - The image path or URL
 * @param {string} type - The type of image (news, portfolio, etc.)
 * @returns {string} The complete image URL
 */
export const getImageUrl = (imagePath, type = 'news') => {
  if (!imagePath) return '';
  
  // If the image is already a full URL, return it as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Ensure API URL doesn't end with a slash
  const apiUrl = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : '';
  
  // Check if imagePath already includes the uploads path
  const hasUploadsPath = imagePath.startsWith('uploads/') || imagePath.startsWith('/uploads/');
  
  // If imagePath already has the full path structure, just add the base API URL
  if (hasUploadsPath) {
    // Normalize path by removing leading slash if present
    const normalizedPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${apiUrl}/${normalizedPath}`;
  }
  
  // Use absolute URL if flag is enabled in environment variables
  const useAbsoluteUrls = process.env.REACT_APP_USE_ABSOLUTE_MEDIA_URLS === 'true';
  
  // If using absolute URLs, construct with API URL
  if (useAbsoluteUrls) {
    let path;
    switch (type) {
      case 'news':
        path = 'uploads/news';
        break;
      case 'portfolio':
        path = 'uploads/portfolio';
        break;
      case 'testimonial':
        path = 'uploads/testimonials';
        break;
      case 'partner':
        path = 'uploads/partners';
        break;
      case 'profile':
        path = 'uploads/profiles';
        break;
      default:
        path = 'uploads';
    }
    return `${apiUrl}/${path}/${imagePath}`;
  } else {
    // For local development, use relative paths
    let baseUrl;
    switch (type) {
      case 'news':
        baseUrl = '/uploads/news';
        break;
      case 'portfolio':
        baseUrl = '/uploads/portfolio';
        break;
      case 'testimonial':
        baseUrl = '/uploads/testimonials';
        break;
      case 'partner':
        baseUrl = '/uploads/partners';
        break;
      case 'profile':
        baseUrl = '/uploads/profiles';
        break;
      default:
        baseUrl = '/uploads';
    }
    return `${baseUrl}/${imagePath}`;
  }
};