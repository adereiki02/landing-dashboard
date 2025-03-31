import React from 'react';
import Button from '../common/Button';
import megaDigital from '../../assets/mega-digital.png';
import bpbdJateng from '../../assets/bpbd-jateng.png';
import psai from '../../assets/psai.png';
import customerQueue from '../../assets/customer-queue.png';
import reikiLogo from '../../assets/reikidevelop.png';

function Hero() {
  const scrollToFeatures = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1>Solusi Digital Terbaik <span>untuk Bisnis Anda</span></h1>
          <h2>Kerjasama dan Solusi IT untuk pengembangan bisnis di era digital</h2>
          <p>
            Kami menyediakan layanan pengembangan web, desain grafis, 
            dan solusi digital yang akan membantu bisnis Anda tumbuh lebih cepat.
          </p>
          <Button className="cta-button" onClick={scrollToFeatures}>
            Jelajahi Layanan Kami
          </Button>
        </div>
        
        <div className="hero-showcase">
          <div className="showcase-wrapper">
            <div className="showcase-box showcase-1">
              <img src={megaDigital} alt="Mega Digital Website" />
              <div className="showcase-label">
                <h3>Mega Digital</h3>
                <p>Retail Electronics Business</p>
              </div>
            </div>
            
            <div className="showcase-box showcase-2">
              <img src={bpbdJateng} alt="BPBD Jawa Tengah Website" />
              <div className="showcase-label">
                <h3>BPBD Jawa Tengah</h3>
                <p>Government Agency</p>
              </div>
            </div>
            
            <div className="showcase-box showcase-3">
              <img src={psai} alt="PSAI Website" />
              <div className="showcase-label">
                <h3>PSAI</h3>
                <p>Sports Organization</p>
              </div>
            </div>
            
            <div className="showcase-box showcase-4">
              <img src={customerQueue} alt="Customer Queue System" />
              <div className="showcase-label">
                <h3>Queue System</h3>
                <p>Digital Service</p>
              </div>
            </div>
            
            <div className="logo-watermark">
              <img src={reikiLogo} alt="reikidevs logo" />
            </div>
            
            <div className="decorative-circle circle-1"></div>
            <div className="decorative-circle circle-2"></div>
            <div className="decorative-line line-1"></div>
            <div className="decorative-line line-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;