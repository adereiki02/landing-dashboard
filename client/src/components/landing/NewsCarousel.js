import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import axios from 'axios';

function NewsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('/api/news?limit=4&status=published');
        setNewsItems(response.data.news);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news');
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  useEffect(() => {
    if (newsItems.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex(prevIndex => 
          prevIndex === newsItems.length - 1 ? 0 : prevIndex + 1
        );
      }, 6000);
      
      return () => clearInterval(interval);
    }
  }, [newsItems.length]);

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  const goToPrevSlide = () => {
    setActiveIndex(prevIndex => 
      prevIndex === 0 ? newsItems.length - 1 : prevIndex - 1
    );
  };

  const goToNextSlide = () => {
    setActiveIndex(prevIndex => 
      prevIndex === newsItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (loading) {
    return (
      <section id="news" className="news-section">
        <div className="container">
          <div className="section-header">
            <h2>Berita Terbaru</h2>
            <p>Memuat berita...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="news" className="news-section">
        <div className="container">
          <div className="section-header">
            <h2>Berita Terbaru</h2>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (newsItems.length === 0) {
    return (
      <section id="news" className="news-section">
        <div className="container">
          <div className="section-header">
            <h2>Berita Terbaru</h2>
            <p>Belum ada berita yang tersedia</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="news-section">
      <div className="container">
        <div className="section-header">
          <h2>Berita Terbaru</h2>
          <p>Informasi terkini tentang proyek dan aktivitas reikidevs</p>
        </div>
        
        <div className="news-carousel">
          <button className="carousel-arrow prev" onClick={goToPrevSlide}>
            <span>&#10094;</span>
          </button>
          
          <div className="carousel-container">
            <div 
              className="carousel-track" 
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {newsItems.map((news) => (
                <div className="news-card" key={news._id}>
                  <div className="news-image">
                    <img src={news.featuredImage} alt={news.title} />
                    <div className="news-category">{news.category}</div>
                  </div>
                  <div className="news-content">
                    <div className="news-date">
                      {new Date(news.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <h3>{news.title}</h3>
                    <p>{news.excerpt}</p>
                    <Link to={`/berita/${news.slug}`} className="read-more">
                      Baca Selengkapnya
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button className="carousel-arrow next" onClick={goToNextSlide}>
            <span>&#10095;</span>
          </button>
        </div>
        
        <div className="carousel-dots">
          {newsItems.map((_, index) => (
            <button 
              key={index} 
              className={`dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
        
        <div className="news-action">
          <Link to="/berita">
            <Button className="btn-secondary">Lihat Semua Berita</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NewsCarousel;