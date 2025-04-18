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
  
  // Determine if we're in development or production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Backend URL - use relative URL in development to leverage the proxy
  const backendUrl = isDevelopment ? '' : 'https://reikidevs-official-production.up.railway.app';
  
  // If the image is already a full URL, handle it
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    const productionUrl = 'https://reikidevs-official-production.up.railway.app';
    
    // If it's already from our production backend and we're in development,
    // convert it to use the proxy
    if (isDevelopment && imagePath.startsWith(productionUrl)) {
      return imagePath.replace(productionUrl, '');
    }
    
    // If it's from another domain but has our path structure, fix it
    if (imagePath.includes('/uploads/news/')) {
      const parts = imagePath.split('/uploads/news/');
      if (parts.length > 1) {
        return `${backendUrl}/uploads/news/${parts[1]}`;
      }
    }
    
    // For other types of uploads
    if (imagePath.includes('/uploads/')) {
      const parts = imagePath.split('/uploads/');
      if (parts.length > 1) {
        return `${backendUrl}/uploads/${parts[1]}`;
      }
    }
    
    // If it's a completely external URL, return it as is
    return imagePath;
  }
  
  // Check if imagePath already includes the uploads path
  const hasUploadsPath = imagePath.startsWith('uploads/') || imagePath.startsWith('/uploads/');
  
  // If imagePath already has the full path structure, add the backend URL if needed
  if (hasUploadsPath) {
    // Normalize path by removing leading slash if present
    const normalizedPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${backendUrl}/${normalizedPath}`;
  }
  
  // Otherwise, construct the path based on the type
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
  
  return `${backendUrl}/${path}/${imagePath}`;
};