import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaFolder } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { getImageUrl } from '../../utils/imageUtils';

const NewsCard = ({ item }) => {
  // Estimate reading time
  const calculateReadingTime = (text) => {
    const words = text.split(/\s+/).length;
    return Math.ceil(words / 40); // Approximate for excerpt
  };
  
  const readingTime = calculateReadingTime(item.excerpt);
  
  // Custom function to ensure image URL has the backend domain
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    // Backend URL
    const backendUrl = 'https://reikidevs-official-production.up.railway.app';
    
    // If the image URL is already a full URL
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      // If it's already from our backend, return it as is
      if (imagePath.startsWith(backendUrl)) {
        return imagePath;
      }
      
      // If it's from another domain but has our path structure, fix it
      if (imagePath.includes('/uploads/news/')) {
        const parts = imagePath.split('/uploads/news/');
        if (parts.length > 1) {
          return `${backendUrl}/uploads/news/${parts[1]}`;
        }
      }
      
      // If it's a completely external URL, return it as is
      return imagePath;
    }
    
    // Check if imagePath already includes the uploads path
    const hasUploadsPath = imagePath.startsWith('uploads/') || imagePath.startsWith('/uploads/');
    
    if (hasUploadsPath) {
      // Normalize path by removing leading slash if present
      const normalizedPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
      return `${backendUrl}/${normalizedPath}`;
    } else {
      // Assume it's a news image
      return `${backendUrl}/uploads/news/${imagePath}`;
    }
  };
  
  return (
    <article className="news-card" role="listitem">
      <Link to={`/berita/${item.slug || item.id}`} className="news-card-link">
        <div className="news-card-image">
          <img 
            src={getFullImageUrl(item.featuredImage || item.image)} 
            alt={item.title} 
            loading="lazy" 
            width="800" 
            height="450"
          />
          <div className="news-category-badge" aria-label={`Kategori: ${item.category}`}>
            <FaFolder aria-hidden="true" /> {item.category}
          </div>
        </div>
        <div className="news-card-content">
          <h2>{item.title}</h2>
          <div className="news-card-meta">
            <time dateTime={item.createdAt || new Date(item.date).toISOString()} className="news-date">
              <FaCalendarAlt aria-hidden="true" /> 
              {item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : item.date}
            </time>
            <span className="news-reading-time">
              <FaClock aria-hidden="true" /> {readingTime} menit
            </span>
          </div>
          <p className="news-excerpt">{item.excerpt}</p>
          <div className="read-more">Baca selengkapnya <span className="visually-hidden">tentang {item.title}</span></div>
        </div>
      </Link>
    </article>
  );
};

NewsCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    slug: PropTypes.string,
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    featuredImage: PropTypes.string,
    category: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    date: PropTypes.string,
    views: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
};

export default NewsCard;