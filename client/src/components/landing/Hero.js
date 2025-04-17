import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import SEO from '../common/SEO';
import { getImageUrl } from '../../utils/imageUtils';
import megaDigital from '../../assets/mega-digital.png';
import bpbdJateng from '../../assets/bpbd-jateng.png';
import psai from '../../assets/psai.png';
import customerQueue from '../../assets/customer-queue.png';
import reikiLogo from '../../assets/reikidevelop.png';

function Hero() {
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

  const scrollToFeatures = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Reiki Develop",
    "description": "Solusi digital terbaik untuk bisnis Anda",
    "url": "https://reikidevelop.com",
    "serviceType": ["Web Development", "Graphic Design", "Digital Solutions"]
  };

  // Mobile showcase component
  const MobileShowcase = () => (
    <div className="mobile-showcase">
      <div className="mobile-showcase-grid">
        <div className="mobile-showcase-item">
          <img src={megaDigital} alt="Mega Digital - Retail Electronics Business Website" loading="lazy" />
          <div className="mobile-showcase-label">
            <h3>Mega Digital</h3>
            <p>Retail Electronics Business</p>
          </div>
        </div>
        
        <div className="mobile-showcase-item">
          <img src={bpbdJateng} alt="BPBD Jawa Tengah - Government Agency Website" loading="lazy" />
          <div className="mobile-showcase-label">
            <h3>BPBD Jawa Tengah</h3>
            <p>Government Agency</p>
          </div>
        </div>
        
        <div className="mobile-showcase-item">
          <img src={psai} alt="PSAI - Sports Organization Website" loading="lazy" />
          <div className="mobile-showcase-label">
            <h3>PSAI</h3>
            <p>Sports Organization</p>
          </div>
        </div>
        
        <div className="mobile-showcase-item">
          <img src={customerQueue} alt="Customer Queue System - Digital Service Application" loading="lazy" />
          <div className="mobile-showcase-label">
            <h3>Queue System</h3>
            <p>Digital Service</p>
          </div>
        </div>
        
        <div className="mobile-logo-watermark">
          <img src={reikiLogo} alt="Reiki Develop logo" />
        </div>
      </div>
    </div>
  );

  // Desktop showcase component
  const DesktopShowcase = () => (
    <div className="hero-showcase">
      <div className="showcase-wrapper">
        <div className="showcase-box showcase-1" role="img" aria-label="Portfolio item: Mega Digital">
          <img src={megaDigital} alt="Mega Digital - Retail Electronics Business Website" loading="lazy" />
          <div className="showcase-label">
            <h3>Mega Digital</h3>
            <p>Retail Electronics Business</p>
          </div>
        </div>
        
        <div className="showcase-box showcase-2" role="img" aria-label="Portfolio item: BPBD Jawa Tengah">
          <img src={bpbdJateng} alt="BPBD Jawa Tengah - Government Agency Website" loading="lazy" />
          <div className="showcase-label">
            <h3>BPBD Jawa Tengah</h3>
            <p>Government Agency</p>
          </div>
        </div>
        
        <div className="showcase-box showcase-3" role="img" aria-label="Portfolio item: PSAI">
          <img src={psai} alt="PSAI - Sports Organization Website" loading="lazy" />
          <div className="showcase-label">
            <h3>PSAI</h3>
            <p>Sports Organization</p>
          </div>
        </div>
        
        <div className="showcase-box showcase-4" role="img" aria-label="Portfolio item: Queue System">
          <img src={customerQueue} alt="Customer Queue System - Digital Service Application" loading="lazy" />
          <div className="showcase-label">
            <h3>Queue System</h3>
            <p>Digital Service</p>
          </div>
        </div>
        
        <div className="logo-watermark" aria-hidden="true">
          <img src={reikiLogo} alt="Reiki Develop logo" />
        </div>
        
        <div className="decorative-circle circle-1" aria-hidden="true"></div>
        <div className="decorative-circle circle-2" aria-hidden="true"></div>
        <div className="decorative-line line-1" aria-hidden="true"></div>
        <div className="decorative-line line-2" aria-hidden="true"></div>
      </div>
    </div>
  );

  return (
    <>
      <SEO 
        title="Reiki Develop - Solusi Digital Terbaik untuk Bisnis Anda"
        description="Solusi digital terbaik untuk bisnis Anda. Layanan pengembangan web, desain grafis, dan solusi digital untuk pertumbuhan bisnis di era digital."
        schemaData={schemaData}
      />
      <section id="home" className="hero-section" aria-label="Beranda">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Solusi Digital Terbaik <span className="highlight">untuk Bisnis Anda</span></h1>
            <h2>Kerjasama dan Solusi IT untuk pengembangan bisnis di era digital</h2>
            <p>
              Kami menyediakan layanan pengembangan web, desain grafis, 
              dan solusi digital yang akan membantu bisnis Anda tumbuh lebih cepat.
            </p>
            <Button 
              className="cta-button" 
              onClick={scrollToFeatures}
              aria-label="Jelajahi Layanan Kami"
            >
              Jelajahi Layanan Kami
            </Button>
          </div>
          
          {isMobile ? <MobileShowcase /> : <DesktopShowcase />}
        </div>
      </section>
    </>
  );
}

export default Hero;