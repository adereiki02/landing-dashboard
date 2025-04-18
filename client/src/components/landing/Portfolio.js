import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import axios from 'axios';
import { getImageUrl } from '../../utils/imageUtils';
import '../../styles/Portfolio.css';

function Portfolio() {
  const [isMobile, setIsMobile] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch featured portfolio items from API
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get('/api/portfolio/featured?limit=4');
        setPortfolioItems(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Failed to load portfolio');
        setLoading(false);
      }
    };
    
    fetchPortfolio();

    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile portfolio component
  const MobilePortfolio = () => (
    <div className="portfolio-grid">
      {portfolioItems.map(item => (
        <div className="portfolio-item" key={item._id}>
          <div className="portfolio-image">
            <img src={getImageUrl(item.featuredImage, 'portfolio')} alt={item.title} loading="lazy" />
          </div>
          <div className="portfolio-content">
            <h3>{item.title}</h3>
            <p>{item.projectType}</p>
          </div>
        </div>
      ))}
    </div>
  );

  // Desktop portfolio component
  const DesktopPortfolio = () => (
    <div className="portfolio-grid">
      {portfolioItems.map((item) => (
        <div 
          className="portfolio-item" 
          key={item._id}
        >
          <div className="portfolio-image">
            <img src={getImageUrl(item.featuredImage, 'portfolio')} alt={item.title} loading="lazy" />
          </div>
          <div className="portfolio-content">
            <h3>{item.title}</h3>
            <p>{item.projectType}</p>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <section id="portfolio" className="portfolio-section">
        <div className="container">
          <div className="section-header">
            <h2>Portofolio Kami</h2>
            <p>Memuat portofolio...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="portfolio" className="portfolio-section">
        <div className="container">
          <div className="section-header">
            <h2>Portofolio Kami</h2>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (portfolioItems.length === 0) {
    return (
      <section id="portfolio" className="portfolio-section">
        <div className="container">
          <div className="section-header">
            <h2>Portofolio Kami</h2>
            <p>Belum ada portofolio yang tersedia</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="portfolio-section">
      <div className="container">
        <div className="section-header">
          <h2>Portofolio Kami</h2>
          <p>Beberapa proyek terbaik yang telah kami kerjakan</p>
        </div>
        
        {isMobile ? <MobilePortfolio /> : <DesktopPortfolio />}
        
        <div className="portfolio-action">
          <Link to="/portfolio">
            <Button className="btn-secondary">Lihat Semua Portofolio</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Portfolio;