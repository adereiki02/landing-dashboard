import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Partners.css';

function Partners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get('/api/partners/active');
        setPartners(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching partners:', err);
        setError('Failed to load partners');
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

  if (error) {
    return (
      <section id="partners" className="partners-section">
        <div className="container">
          <div className="section-header">
            <h2>Mitra Kerjasama</h2>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return (
      <section id="partners" className="partners-section">
        <div className="container">
          <div className="section-header">
            <h2>Mitra Kerjasama</h2>
            <p>Belum ada mitra kerjasama yang tersedia</p>
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
        </div>
        
        <div className="partners-grid">
          {partners.map(partner => (
            <div className="partner-item" key={partner._id}>
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className="partner-logo" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Partners;