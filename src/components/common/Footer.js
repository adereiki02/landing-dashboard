import React from 'react';
import logoImage from '../../assets/reikidevelop.png'; // Pastikan untuk menyimpan logo di folder assets

function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={logoImage} alt="ReiKi Develop Logo" className="footer-logo-image" />
            <p>Solusi Digital Terbaik untuk Bisnis Anda</p>
            
            <div className="contact-info">
              <h3>Hubungi Kami</h3>
              <p>
                Mari bekerja sama untuk mewujudkan solusi digital terbaik. 
                Hubungi kami sekarang untuk konsultasi gratis!
              </p>
              
              <div className="social-links">
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
                  <i className="fab fa-whatsapp"></i>
                  <span>WhatsApp</span>
                </a>
                <a href="https://instagram.com/reikidevs" target="_blank" rel="noopener noreferrer" className="social-link instagram">
                  <i className="fab fa-instagram"></i>
                  <span>Instagram</span>
                </a>
                <a href="https://facebook.com/reikidevs" target="_blank" rel="noopener noreferrer" className="social-link facebook">
                  <i className="fab fa-facebook"></i>
                  <span>Facebook</span>
                </a>
                <a href="https://linkedin.com/reikidevs" target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                  <i className="fab fa-linkedin"></i>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-column">
              <h3>Layanan</h3>
              <ul>
                <li>Pengembangan Web</li>
                <li>Desain Web</li>
                <li>Optimasi Web SEO</li>
                <li>Desain Grafis</li>
                <li>Videografi</li>
                <li>Desain PPT</li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3>Navigasi</h3>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#features">Layanan</a></li>
                <li><a href="#testimonials">Testimonial</a></li>
                <li><a href="#contact">Kontak</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3>Kontak</h3>
              <ul>
                <li>Email: info@reikidevs.com</li>
                <li>Phone: +62-812-3456-7890</li>
                <li>Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {year} Reiki Develops. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;