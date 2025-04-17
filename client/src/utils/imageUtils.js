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
  
  // Check if imagePath already includes the uploads path
  const hasUploadsPath = imagePath.startsWith('uploads/') || imagePath.startsWith('/uploads/');
  
  // If imagePath already has the full path structure, just add the base API URL
  if (hasUploadsPath) {
    // Normalize path by removing leading slash if present
    const normalizedPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${process.env.REACT_APP_API_URL}/${normalizedPath}`;
  }
  
  // Use absolute URL if flag is enabled in environment variables
  const useAbsoluteUrls = process.env.REACT_APP_USE_ABSOLUTE_MEDIA_URLS === 'true';
  
  // Select the appropriate base URL based on image type
  let baseUrl;
  switch (type) {
    case 'news':
      baseUrl = useAbsoluteUrls ? process.env.REACT_APP_NEWS_IMAGES_URL : '/uploads/news';
      break;
    case 'portfolio':
      baseUrl = useAbsoluteUrls ? process.env.REACT_APP_PORTFOLIO_IMAGES_URL : '/uploads/portfolio';
      break;
    case 'testimonial':
      baseUrl = useAbsoluteUrls ? process.env.REACT_APP_TESTIMONIAL_IMAGES_URL : '/uploads/testimonials';
      break;
    case 'partner':
      baseUrl = useAbsoluteUrls ? process.env.REACT_APP_PARTNER_IMAGES_URL : '/uploads/partners';
      break;
    case 'profile':
      baseUrl = useAbsoluteUrls ? process.env.REACT_APP_PROFILE_IMAGES_URL : '/uploads/profiles';
      break;
    default:
      baseUrl = useAbsoluteUrls ? process.env.REACT_APP_DEFAULT_IMAGES_URL : '/uploads';
  }
  
  // Construct the URL with the appropriate base
  return `${baseUrl}/${imagePath}`;
};