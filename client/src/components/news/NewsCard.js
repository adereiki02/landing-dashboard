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
  
  return (
    <article className="news-card" role="listitem">
      <Link to={`/berita/${item.slug || item.id}`} className="news-card-link">
        <div className="news-card-image">
          <img 
            src={getImageUrl(item.featuredImage || item.image, 'news')} 
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