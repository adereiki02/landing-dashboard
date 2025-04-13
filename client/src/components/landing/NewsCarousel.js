import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

function NewsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Data dummy berita
  const newsItems = [
    {
      id: 1,
      title: "Peluncuran Website Baru BPBD Jawa Tengah",
      date: "15 Juni 2023",
      excerpt: "reikidevs berhasil meluncurkan website baru untuk Badan Penanggulangan Bencana Daerah (BPBD) Jawa Tengah dengan fitur pelaporan bencana real-time.",
      image: "https://images.unsplash.com/photo-1593642532400-2682810df593?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Proyek Terbaru"
    },
    {
      id: 2,
      title: "Aplikasi Antrian Digital untuk Rumah Sakit",
      date: "3 Mei 2023",
      excerpt: "Sistem antrian digital yang dikembangkan oleh reikidevs kini telah diimplementasikan di 5 rumah sakit besar di Indonesia.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Inovasi"
    },
    {
      id: 3,
      title: "reikidevs Raih Penghargaan Top Digital Agency 2023",
      date: "20 April 2023",
      excerpt: "reikidevs berhasil meraih penghargaan sebagai Top Digital Agency 2023 dalam ajang Indonesia Digital Awards.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Penghargaan"
    },
    {
      id: 4,
      title: "Workshop Digital Marketing untuk UKM",
      date: "10 Maret 2023",
      excerpt: "reikidevs mengadakan workshop digital marketing gratis untuk membantu UKM meningkatkan presence online mereka.",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Event"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => 
        prevIndex === newsItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);
    
    return () => clearInterval(interval);
  }, [newsItems.length]);

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  const goToPrevSlide = () => {
    setActiveIndex(prevIndex => 
      prevIndex === 0 ? newsItems.length - 1 : prevIndex - 1
    );
  };

  const goToNextSlide = () => {
    setActiveIndex(prevIndex => 
      prevIndex === newsItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section id="news" className="news-section">
      <div className="container">
        <div className="section-header">
          <h2>Berita Terbaru</h2>
          <p>Informasi terkini tentang proyek dan aktivitas reikidevs</p>
        </div>
        
        <div className="news-carousel">
          <button className="carousel-arrow prev" onClick={goToPrevSlide}>
            <span>&#10094;</span>
          </button>
          
          <div className="carousel-container">
            <div 
              className="carousel-track" 
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {newsItems.map((news) => (
                <div className="news-card" key={news.id}>
                  <div className="news-image">
                    <img src={news.image} alt={news.title} />
                    <div className="news-category">{news.category}</div>
                  </div>
                  <div className="news-content">
                    <div className="news-date">{news.date}</div>
                    <h3>{news.title}</h3>
                    <p>{news.excerpt}</p>
                    <Link to={`/berita/${news.id}`} className="read-more">
                      Baca Selengkapnya
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button className="carousel-arrow next" onClick={goToNextSlide}>
            <span>&#10095;</span>
          </button>
        </div>
        
        <div className="carousel-dots">
          {newsItems.map((_, index) => (
            <button 
              key={index} 
              className={`dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
        
        <div className="news-action">
          <Link to="/berita">
            <Button className="btn-secondary">Lihat Semua Berita</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NewsCarousel;