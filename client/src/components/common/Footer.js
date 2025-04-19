import React from 'react';
import { useSettings } from '../../context/SettingsContext';

function Footer() {
  const year = new Date().getFullYear();
  const { settings } = useSettings();
  
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={settings.logo} alt={settings.siteName} className="footer-logo-image" />
            <p>{settings.siteDescription}</p>
            
            <div className="contact-info">
              <h3>Hubungi Kami</h3>
              <p>
                Mari bekerja sama untuk mewujudkan solusi digital terbaik. 
                Hubungi kami sekarang untuk konsultasi gratis!
              </p>
              
              <div className="social-links-container">
                <h4>Ikuti Kami</h4>
                <div className="social-links">
                  {settings.socialMedia?.whatsapp && (
                    <a href={settings.socialMedia.whatsapp} target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
                      <i className="fab fa-whatsapp"></i>
                    </a>
                  )}
                  {settings.socialMedia?.instagram && (
                    <a href={settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="social-link instagram">
                      <i className="fab fa-instagram"></i>
                    </a>
                  )}
                  {settings.socialMedia?.facebook && (
                    <a href={settings.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="social-link facebook">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  )}
                  {settings.socialMedia?.linkedin && (
                    <a href={settings.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  )}
                  {settings.socialMedia?.twitter && (
                    <a href={settings.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="social-link twitter">
                      <i className="fab fa-twitter"></i>
                    </a>
                  )}
                  {settings.socialMedia?.youtube && (
                    <a href={settings.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="social-link youtube">
                      <i className="fab fa-youtube"></i>
                    </a>
                  )}
                </div>
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
                <li><a href="#news">Berita</a></li>
                <li><a href="#testimonials">Testimonial</a></li>
                <li><a href="#contact">Kontak</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3>Kontak</h3>
              <ul>
                <li>Email: {settings.contactEmail}</li>
                <li>Phone: {settings.contactPhone}</li>
                <li>{settings.address}</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {year} {settings.siteName}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;