import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../../utils/imageUtils';

function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: "Budi Santoso",
      role: "CEO, PT Maju Jaya",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      text: "reikidevs telah membantu kami mengembangkan website yang sangat meningkatkan penjualan online kami sebesar 40%. Desain yang menarik dan fungsionalitas yang lengkap!"
    },
    {
      id: 2,
      name: "Siti Rahayu",
      role: "Marketing Director, StartUp Indonesia",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      text: "Layanan SEO dari reikidevs membantu website kami naik ke halaman pertama Google dalam 3 bulan. Tim yang profesional dan hasil yang luar biasa!"
    },
    {
      id: 3,
      name: "Ahmad Fadli",
      role: "Owner, Fadli Design",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      text: "Saya sangat puas dengan kualitas desain grafis dan videografi yang reikidevs buat untuk bisnis saya. Sangat merekomendasikan jasa mereka!"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <h2>Testimonial</h2>
          <p>Apa kata klien kami tentang layanan reikidevs</p>
        </div>
        
        <div className="testimonials-slider">
          <div className="testimonials-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {testimonials.map(testimonial => (
              <div className="testimonial-card" key={testimonial.id}>
                <div className="testimonial-content">
                  <p>"{testimonial.text}"</p>
                </div>
                <div className="testimonial-author">
                  <img src={getImageUrl(testimonial.image, 'testimonial')} alt={testimonial.name} />
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button 
                key={index} 
                className={`dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;