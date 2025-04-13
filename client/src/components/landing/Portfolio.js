import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import megaDigital from '../../assets/mega-digital.png';
import bpbdJateng from '../../assets/bpbd-jateng.png';
import psai from '../../assets/psai.png';
import customerQueue from '../../assets/customer-queue.png';
import '../../styles/Portfolio.css';

function Portfolio() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
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

  // Portfolio items data
  const portfolioItems = [
    {
      id: 1,
      title: "Mega Digital",
      description: "Retail Electronics Business",
      image: megaDigital,
      alt: "Mega Digital - Retail Electronics Business Website"
    },
    {
      id: 2,
      title: "BPBD Jawa Tengah",
      description: "Government Agency",
      image: bpbdJateng,
      alt: "BPBD Jawa Tengah - Government Agency Website"
    },
    {
      id: 3,
      title: "PSAI",
      description: "Sports Organization",
      image: psai,
      alt: "PSAI - Sports Organization Website"
    },
    {
      id: 4,
      title: "Queue System",
      description: "Digital Service",
      image: customerQueue,
      alt: "Customer Queue System - Digital Service Application"
    }
  ];

  // Mobile portfolio component
  const MobilePortfolio = () => (
    <div className="portfolio-grid">
      {portfolioItems.map(item => (
        <div className="portfolio-item" key={item.id}>
          <div className="portfolio-image">
            <img src={item.image} alt={item.alt} loading="lazy" />
          </div>
          <div className="portfolio-content">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
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
          key={item.id}
        >
          <div className="portfolio-image">
            <img src={item.image} alt={item.alt} loading="lazy" />
          </div>
          <div className="portfolio-content">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );

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