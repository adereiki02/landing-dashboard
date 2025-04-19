import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getImageUrl } from '../../utils/imageUtils';
import '../../styles/Partners.css';

// Fallback partner data in case API fails
const fallbackPartners = [
  {
    _id: 'fallback1',
    name: 'Google Cloud',
    logo: 'https://via.placeholder.com/200x100?text=Google+Cloud'
  },
  {
    _id: 'fallback2',
    name: 'Adobe Creative Cloud',
    logo: 'https://via.placeholder.com/200x100?text=Adobe+CC'
  },
  {
    _id: 'fallback3',
    name: 'Microsoft',
    logo: 'https://via.placeholder.com/200x100?text=Microsoft'
  },
  {
    _id: 'fallback4',
    name: 'AWS',
    logo: 'https://via.placeholder.com/200x100?text=AWS'
  }
];

function Partners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        console.log('Fetching partners from:', '/api/partners/active');
        const response = await axios.get('/api/partners/active');
        console.log('Partners response:', response.data);
        
        if (response.data && response.data.length > 0) {
          setPartners(response.data);
        } else {
          console.log('No partners returned from API, using fallbacks');
          setPartners(fallbackPartners);
          setUsedFallback(true);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching partners:', err);
        console.log('Using fallback partners due to error');
        setPartners(fallbackPartners);
        setUsedFallback(true);
        setError(null); // Clear error since we're using fallbacks
        setLoading(false);
      }
    };
    
    fetchPartners();
  }, []);

  if (loading) {
    return (
      <section id="partners" className="partners-section">
        <div className="container">
          <div className="section-header">
            <h2>Mitra Kerjasama</h2>
            <p>Memuat mitra kerjasama...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="partners" className="partners-section">
      <div className="container">
        <div className="section-header">
          <h2>Mitra Kerjasama</h2>
          <p>Kami telah dipercaya oleh berbagai lembaga dan perusahaan terkemuka</p>
          {usedFallback && <small className="fallback-notice">(Menggunakan data contoh)</small>}
        </div>
        
        <div className="partners-grid">
          {partners.map(partner => (
            <div className="partner-item" key={partner._id}>
              <img 
                src={partner.logo.startsWith('http') ? partner.logo : getImageUrl(partner.logo, 'partner')} 
                alt={partner.name} 
                className="partner-logo" 
                onError={(e) => {
                  console.log('Image failed to load:', partner.logo);
                  e.target.src = 'https://via.placeholder.com/200x100?text=Partner';
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Partners;