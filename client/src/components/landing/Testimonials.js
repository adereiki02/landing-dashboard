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
    },
    {
      id: 4,
      name: "Dewi Kusuma",
      role: "Founder, Batik Nusantara",
      image: "https://randomuser.me/api/portraits/women/22.jpg",
      text: "Berkat aplikasi e-commerce yang dikembangkan oleh reikidevs, penjualan batik kami meningkat hingga 65% dalam 6 bulan terakhir. Proses pengembangan yang sangat kolaboratif dan hasilnya melebihi ekspektasi kami."
    },
    {
      id: 5,
      name: "Raden Wijaya",
      role: "CTO, Fintech Sejahtera",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "Kami memilih reikidevs untuk mengembangkan platform fintech kami karena reputasi mereka dalam keamanan sistem. Hasilnya luar biasa, dengan zero security breach selama 2 tahun beroperasi dan antarmuka yang sangat user-friendly."
    },
    {
      id: 6,
      name: "Anisa Wijayanti",
      role: "Digital Marketing Manager, Toko Sehat",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      text: "Strategi digital marketing yang dirancang oleh reikidevs berhasil meningkatkan traffic website kami sebesar 120% dan konversi penjualan naik 35%. Tim mereka sangat responsif dan selalu update dengan tren terbaru."
    },
    {
      id: 7,
      name: "Hendra Gunawan",
      role: "Direktur, PT Konstruksi Andalan",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      text: "Website company profile yang dibuat oleh reikidevs sangat membantu kami mendapatkan klien-klien besar. Desainnya profesional dan mencerminkan identitas perusahaan kami dengan sempurna."
    },
    {
      id: 8,
      name: "Maya Sari",
      role: "Owner, Kuliner Nusantara",
      image: "https://randomuser.me/api/portraits/women/28.jpg",
      text: "Aplikasi pemesanan online yang dikembangkan reikidevs telah mengubah bisnis restoran kami. Proses pemesanan menjadi lebih efisien dan pelanggan sangat menyukai kemudahannya. Terima kasih reikidevs!"
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