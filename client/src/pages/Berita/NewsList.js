import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import '../../styles/NewsList.css';

// Menggunakan data berita yang sama dengan NewsDetail
const newsItems = [
  {
    id: 1,
    title: "Peluncuran Website Baru BPBD Jawa Tengah",
    date: "15 Juni 2023",
    excerpt: "reikidevs berhasil meluncurkan website baru untuk Badan Penanggulangan Bencana Daerah (BPBD) Jawa Tengah dengan fitur pelaporan bencana real-time.",
    image: "https://images.unsplash.com/photo-1593642532400-2682810df593?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Proyek Terbaru",
  },
  {
    id: 2,
    title: "Aplikasi Antrian Digital untuk Rumah Sakit",
    date: "3 Mei 2023",
    excerpt: "Sistem antrian digital yang dikembangkan oleh reikidevs kini telah diimplementasikan di 5 rumah sakit besar di Indonesia.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Inovasi",
  },
  {
    id: 3,
    title: "reikidevs Raih Penghargaan Top Digital Agency 2023",
    date: "20 April 2023",
    excerpt: "reikidevs berhasil meraih penghargaan sebagai Top Digital Agency 2023 dalam ajang Indonesia Digital Awards.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Penghargaan",
  },
  {
    id: 4,
    title: "Workshop Digital Marketing untuk UKM",
    date: "10 Maret 2023",
    excerpt: "reikidevs mengadakan workshop digital marketing gratis untuk membantu UKM meningkatkan presence online mereka.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Event",
  }
];

// Daftar kategori unik dari berita
const categories = [...new Set(newsItems.map(item => item.category))];

// Ekstrak bulan dan tahun dari tanggal berita untuk arsip
const getMonthYear = (dateStr) => {
  const [, month, year] = dateStr.split(' ');
  return `${month} ${year}`;
};

const archives = [...new Set(newsItems.map(item => getMonthYear(item.date)))];

function NewsList() {
  const [filteredNews, setFilteredNews] = useState(newsItems);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [activeArchive, setActiveArchive] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    document.title = "Blog - reikidevs";
  }, []);

  // Control back to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    let result = newsItems;
    
    // Filter berdasarkan kategori
    if (activeCategory !== 'Semua') {
      result = result.filter(item => item.category === activeCategory);
    }
    
    // Filter berdasarkan arsip (bulan & tahun)
    if (activeArchive) {
      result = result.filter(item => getMonthYear(item.date) === activeArchive);
    }
    
    // Filter berdasarkan pencarian
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.excerpt.toLowerCase().includes(term)
      );
    }
    
    setFilteredNews(result);
  }, [activeCategory, activeArchive, searchTerm]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setActiveArchive('');
  };

  const handleArchiveClick = (archive) => {
    setActiveArchive(archive);
    setActiveCategory('Semua');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  return (
    <div className="news-list-page">
      <Navbar />
      
      <div className="news-list-hero">
        <div className="news-list-hero-content">
          <h1>Blog reikidevs</h1>
          <p>Berita terbaru, update proyek, dan insight dari tim reikidevs</p>
        </div>
      </div>
      
      <div className="news-list-container">
        <div className="news-list-layout">
          {/* Left Sidebar */}
          <div className="news-sidebar-left">
            <div className="sidebar-section">
              <h3>Kategori</h3>
              <ul className="category-list">
                <li>
                  <button 
                    className={activeCategory === 'Semua' ? 'active' : ''}
                    onClick={() => handleCategoryClick('Semua')}
                  >
                    Semua
                  </button>
                </li>
                {categories.map(category => (
                  <li key={category}>
                    <button 
                      className={activeCategory === category ? 'active' : ''}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="sidebar-section">
              <h3>Arsip</h3>
              <ul className="archive-list">
                {archives.map(archive => (
                  <li key={archive}>
                    <button 
                      className={activeArchive === archive ? 'active' : ''}
                      onClick={() => handleArchiveClick(archive)}
                    >
                      {archive}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="news-main-content">
            <div className="news-search-bar">
              <form onSubmit={handleSearch}>
                <div className="search-input-wrapper">
                  <input 
                    type="text" 
                    placeholder="Cari berita..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit">Cari</button>
                </div>
              </form>
            </div>
            
            {filteredNews.length > 0 ? (
              <div className="news-grid">
                {filteredNews.map(item => (
                  <div key={item.id} className="news-card">
                    <Link to={`/berita/${item.id}`} className="news-card-link">
                      <div className="news-card-image">
                        <img src={item.image} alt={item.title} />
                        <div className="news-category-badge">{item.category}</div>
                      </div>
                      <div className="news-card-content">
                        <h2>{item.title}</h2>
                        <div className="news-card-meta">
                          <span className="news-date">{item.date}</span>
                        </div>
                        <p className="news-excerpt">{item.excerpt}</p>
                        <div className="read-more">Baca selengkapnya</div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h2>Tidak ada berita ditemukan</h2>
                <p>Coba ubah filter atau kata kunci pencarian Anda.</p>
              </div>
            )}
          </div>
          
          {/* Right Sidebar */}
          <div className="news-sidebar-right">
            <div className="sidebar-section">
              <h3>Berita Terbaru</h3>
              <div className="latest-news-list">
                {newsItems.slice(0, 3).map(item => (
                  <div key={item.id} className="latest-news-item">
                    <Link to={`/berita/${item.id}`} className="latest-news-link">
                      <div className="latest-news-image">
                        <img src={item.image} alt={item.title} />
                      </div>
                      <div className="latest-news-info">
                        <h4>{item.title}</h4>
                        <span className="latest-news-date">{item.date}</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="sidebar-section">
              <h3>Ikuti Kami</h3>
              <div className="social-links">
                  <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
                    <i className="fab fa-whatsapp"></i>
                  </a>
                  <a href="https://instagram.com/reikidevs" target="_blank" rel="noopener noreferrer" className="social-link instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="https://facebook.com/reikidevs" target="_blank" rel="noopener noreferrer" className="social-link facebook">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="https://linkedin.com/reikidevs" target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default NewsList;;