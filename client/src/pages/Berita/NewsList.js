import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import BackToTop from '../../components/common/BackToTop';
import '../../styles/NewsList.css';
import '../../styles/BackToTop.css';
import { FaCalendarAlt, FaEye, FaClock, FaSearch, FaTags, FaFolder, FaChevronRight, FaFilter, FaTimes, FaArrowUp } from 'react-icons/fa';

// Menggunakan data berita yang sama dengan NewsDetail
const newsItems = [
  {
    id: 1,
    title: "Peluncuran Website Baru BPBD Jawa Tengah",
    date: "15 Juni 2023",
    excerpt: "reikidevs berhasil meluncurkan website baru untuk Badan Penanggulangan Bencana Daerah (BPBD) Jawa Tengah dengan fitur pelaporan bencana real-time.",
    image: "https://images.unsplash.com/photo-1593642532400-2682810df593?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Proyek Terbaru",
    tags: ["website", "pemerintah", "disaster management"],
    author: "Tim reikidevs",
    readingTime: "5 menit",
    views: 1240,
    slug: "peluncuran-website-baru-bpbd-jawa-tengah"
  },
  {
    id: 2,
    title: "Aplikasi Antrian Digital untuk Rumah Sakit",
    date: "3 Mei 2023",
    excerpt: "Sistem antrian digital yang dikembangkan oleh reikidevs kini telah diimplementasikan di 5 rumah sakit besar di Indonesia.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Inovasi",
    tags: ["aplikasi", "healthcare", "digital transformation"],
    author: "Budi Santoso",
    readingTime: "4 menit",
    views: 980,
    slug: "aplikasi-antrian-digital-untuk-rumah-sakit"
  },
  {
    id: 3,
    title: "reikidevs Raih Penghargaan Top Digital Agency 2023",
    date: "20 April 2023",
    excerpt: "reikidevs berhasil meraih penghargaan sebagai Top Digital Agency 2023 dalam ajang Indonesia Digital Awards.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Penghargaan",
    tags: ["award", "digital agency", "prestasi"],
    author: "Dewi Lestari",
    readingTime: "3 menit",
    views: 1560,
    slug: "reikidevs-raih-penghargaan-top-digital-agency-2023"
  },
  {
    id: 4,
    title: "Workshop Digital Marketing untuk UKM",
    date: "10 Maret 2023",
    excerpt: "reikidevs mengadakan workshop digital marketing gratis untuk membantu UKM meningkatkan presence online mereka.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Event",
    tags: ["workshop", "digital marketing", "UKM"],
    author: "Andi Wijaya",
    readingTime: "6 menit",
    views: 820,
    slug: "workshop-digital-marketing-untuk-ukm"
  },
  {
    id: 5,
    title: "Tren Teknologi Web yang Perlu Diperhatikan di 2023",
    date: "25 Februari 2023",
    excerpt: "Perkembangan teknologi web terus bergerak cepat. Simak tren terbaru yang perlu diperhatikan para developer dan bisnis di tahun 2023.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Teknologi",
    tags: ["web development", "trend", "teknologi"],
    author: "Rini Puspita",
    readingTime: "8 menit",
    views: 2100,
    slug: "tren-teknologi-web-yang-perlu-diperhatikan-di-2023"
  },
  {
    id: 6,
    title: "Pentingnya User Experience dalam Pengembangan Aplikasi",
    date: "12 Januari 2023",
    excerpt: "User Experience (UX) menjadi faktor krusial dalam kesuksesan sebuah aplikasi. Pelajari bagaimana meningkatkan UX dalam produk digital Anda.",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Desain",
    tags: ["UX", "desain", "aplikasi"],
    author: "Maya Sari",
    readingTime: "7 menit",
    views: 1750,
    slug: "pentingnya-user-experience-dalam-pengembangan-aplikasi"
  }
];

// Daftar kategori unik dari berita
const categories = [...new Set(newsItems.map(item => item.category))];

// Daftar tag unik dari berita
const allTags = [...new Set(newsItems.flatMap(item => item.tags))];

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
  const [activeTags, setActiveTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // SEO-related metadata
  const pageTitle = "Blog reikidevs - Berita Terbaru dan Insight Teknologi";
  const pageDescription = "Temukan berita terbaru, update proyek, dan insight teknologi dari tim reikidevs. Kami berbagi pengetahuan dan pengalaman dalam pengembangan web, mobile, dan solusi digital.";

  useEffect(() => {
    document.title = pageTitle;
  }, []);

  useEffect(() => {
    // Simulate loading state for better UX
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      let result = newsItems;
      
      // Filter berdasarkan kategori
      if (activeCategory !== 'Semua') {
        result = result.filter(item => item.category === activeCategory);
      }
      
      // Filter berdasarkan arsip (bulan & tahun)
      if (activeArchive) {
        result = result.filter(item => getMonthYear(item.date) === activeArchive);
      }
      
      // Filter berdasarkan tag
      if (activeTags.length > 0) {
        result = result.filter(item => 
          activeTags.some(tag => item.tags && item.tags.includes(tag))
        );
      }
      
      // Filter berdasarkan pencarian
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(item => 
          item.title.toLowerCase().includes(term) || 
          item.excerpt.toLowerCase().includes(term) ||
          (item.tags && item.tags.some(tag => tag.toLowerCase().includes(term)))
        );
      }
      
      setFilteredNews(result);
      setCurrentPage(1); // Reset to first page when filters change
      setIsLoading(false);
    }, 400); // Small delay to show loading state
    
    return () => clearTimeout(timer);
  }, [activeCategory, activeArchive, activeTags, searchTerm]);

  const handleCategoryClick = (category) => {
    setIsLoading(true);
    setActiveCategory(category);
    if (category !== 'Semua') {
      setActiveArchive('');
    }
    // Close mobile filters if open
    setShowMobileFilters(false);
  };

  const handleArchiveClick = (archive) => {
    setIsLoading(true);
    setActiveArchive(archive === activeArchive ? '' : archive);
    // Close mobile filters if open
    setShowMobileFilters(false);
  };
  
  const handleTagClick = (tag) => {
    setIsLoading(true);
    setActiveTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
    // Close mobile filters if open
    setShowMobileFilters(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Search is already handled by the useEffect
    // Close mobile filters if open
    setShowMobileFilters(false);
  };
  
  const handleClearFilters = () => {
    setIsLoading(true);
    setActiveCategory('Semua');
    setActiveArchive('');
    setActiveTags([]);
    setSearchTerm('');
    // Close mobile filters if open
    setShowMobileFilters(false);
  };
  
  const toggleMobileFilters = () => {
    setShowMobileFilters(prev => !prev);
  };
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of results
    document.querySelector('.news-content').scrollIntoView({ behavior: 'smooth' });
  };
  
  // Generate pagination items
  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <li key={i}>
        <button 
          onClick={() => paginate(i)} 
          className={currentPage === i ? 'active' : ''}
          aria-label={`Halaman ${i}`}
          aria-current={currentPage === i ? 'page' : undefined}
        >
          {i}
        </button>
      </li>
    );
  }

  return (
    <div className="news-list-page">
      {/* SEO Metadata */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="reikidevs, blog, teknologi, web development, digital agency, berita teknologi" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://reikidevs.com/blog" />
        <meta property="og:image" content="https://reikidevs.com/images/blog-cover.jpg" />
        <link rel="canonical" href="https://reikidevs.com/blog" />
        {/* Schema.org markup for Google */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": pageTitle,
            "description": pageDescription,
            "url": "https://reikidevs.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "reikidevs",
              "logo": {
                "@type": "ImageObject",
                "url": "https://reikidevs.com/images/logo.png"
              }
            }
          })}
        </script>
      </Helmet>
      
      <Navbar />
      
      <div className="news-list-hero">
        <div className="news-list-hero-content">
          <h1>Blog reikidevs</h1>
          <p>Berita terbaru, update proyek, dan insight dari tim reikidevs</p>
          
          {/* Hero search form */}
          <form className="hero-search-form" onSubmit={handleSearch}>
            <div className="hero-search-input-wrapper">
              <input 
                type="text" 
                placeholder="Cari artikel..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Cari artikel"
              />
              <button type="submit" aria-label="Tombol cari">
                <FaSearch /> Cari
              </button>
            </div>
          </form>
          
          {/* Hero category filters */}
          <div className="hero-category-filters">
            <button 
              className={activeCategory === 'Semua' ? 'active' : ''}
              onClick={() => handleCategoryClick('Semua')}
              aria-pressed={activeCategory === 'Semua'}
            >
              Semua
            </button>
            {categories.map(category => (
              <button 
                key={category}
                className={activeCategory === category ? 'active' : ''}
                onClick={() => handleCategoryClick(category)}
                aria-pressed={activeCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="news-list-container">
        {/* Breadcrumbs for SEO */}
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link to="/" itemProp="item">
                <span itemProp="name">Beranda</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span itemProp="name">Blog</span>
              <meta itemProp="position" content="2" />
            </li>
          </ol>
        </nav>
        
        {/* Active filters display */}
        {(activeCategory !== 'Semua' || activeArchive || activeTags.length > 0 || searchTerm) && (
          <div className="active-filters">
            <span className="active-filters-label">Filter Aktif:</span>
            <div className="active-filters-list">
              {activeCategory !== 'Semua' && (
                <div className="active-filter-item">
                  <span>Kategori: {activeCategory}</span>
                  <button onClick={() => handleCategoryClick('Semua')} aria-label={`Hapus filter kategori ${activeCategory}`}>
                    <FaTimes />
                  </button>
                </div>
              )}
              {activeArchive && (
                <div className="active-filter-item">
                  <span>Arsip: {activeArchive}</span>
                  <button onClick={() => handleArchiveClick(activeArchive)} aria-label={`Hapus filter arsip ${activeArchive}`}>
                    <FaTimes />
                  </button>
                </div>
              )}
              {activeTags.map(tag => (
                <div key={tag} className="active-filter-item">
                  <span>Tag: {tag}</span>
                  <button onClick={() => handleTagClick(tag)} aria-label={`Hapus filter tag ${tag}`}>
                    <FaTimes />
                  </button>
                </div>
              ))}
              {searchTerm && (
                <div className="active-filter-item">
                  <span>Pencarian: {searchTerm}</span>
                  <button onClick={() => setSearchTerm('')} aria-label={`Hapus pencarian ${searchTerm}`}>
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>
            <button className="reset-all-filters" onClick={handleClearFilters} aria-label="Hapus semua filter">
              <FaTimes /> Hapus Semua
            </button>
          </div>
        )}
        
        {/* Mobile filter toggle */}
        <button className="mobile-filter-toggle" onClick={toggleMobileFilters} aria-expanded={showMobileFilters}>
          <FaFilter /> Filter
          <span className="filter-count">
            {(activeCategory !== 'Semua' ? 1 : 0) + 
             (activeArchive ? 1 : 0) + 
             activeTags.length + 
             (searchTerm ? 1 : 0)}
          </span>
        </button>
        
        <div className={`news-list-main ${showMobileFilters ? 'show-mobile-filters' : ''}`}>
          {/* Left Sidebar */}
          <div className="news-sidebar-left">
            <div className="sidebar-section">
              <h2>Kategori</h2>
              <ul className="category-list">
                <li>
                  <button 
                    className={activeCategory === 'Semua' ? 'active' : ''}
                    onClick={() => handleCategoryClick('Semua')}
                    aria-pressed={activeCategory === 'Semua'}
                  >
                    <FaFolder /> Semua
                    <span className="category-count">{newsItems.length}</span>
                  </button>
                </li>
                {categories.map(category => {
                  const count = newsItems.filter(item => item.category === category).length;
                  return (
                    <li key={category}>
                      <button 
                        className={activeCategory === category ? 'active' : ''}
                        onClick={() => handleCategoryClick(category)}
                        aria-pressed={activeCategory === category}
                      >
                        <FaFolder /> {category}
                        <span className="category-count">{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <div className="sidebar-section">
              <h2>Arsip</h2>
              <ul className="archive-list">
                {archives.map(archive => {
                  const count = newsItems.filter(item => getMonthYear(item.date) === archive).length;
                  return (
                    <li key={archive}>
                      <button 
                        className={activeArchive === archive ? 'active' : ''}
                        onClick={() => handleArchiveClick(archive)}
                        aria-pressed={activeArchive === archive}
                      >
                        <FaCalendarAlt /> {archive}
                        <span className="archive-count">{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <div className="sidebar-section">
              <h2>Tag</h2>
              <div className="tag-cloud">
                {allTags.map(tag => {
                  const count = newsItems.filter(item => item.tags && item.tags.includes(tag)).length;
                  return (
                    <button 
                      key={tag}
                      className={`tag-button ${activeTags.includes(tag) ? 'active' : ''}`}
                      onClick={() => handleTagClick(tag)}
                      aria-pressed={activeTags.includes(tag)}
                    >
                      <FaTags /> {tag} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Mobile filter close button */}
            <button className="mobile-filter-close" onClick={toggleMobileFilters}>
              <FaTimes /> Tutup Filter
            </button>
          </div>
          
          {/* Main Content */}
          <div className="news-content">
            {isLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Memuat artikel...</p>
              </div>
            ) : filteredNews.length > 0 ? (
              <>
                <div className="news-results-info">
                  <span>Menampilkan {filteredNews.length} artikel</span>
                </div>
                
                <div className="news-grid">
                  {currentItems.map(item => (
                    <div key={item.id} className="news-card">
                      <Link to={`/berita/${item.slug}`} className="news-card-link">
                        <div className="news-card-image">
                          <img src={item.image} alt={item.title} loading="lazy" />
                          <div className="news-category-badge">
                            <FaFolder /> {item.category}
                          </div>
                        </div>
                        <div className="news-card-content">
                          <div className="news-card-meta">
                            <span className="news-date">
                              <FaCalendarAlt /> {item.date}
                            </span>
                            <span className="news-views">
                              <FaEye /> {item.views}
                            </span>
                            <span className="news-reading-time">
                              <FaClock /> {item.readingTime}
                            </span>
                          </div>
                          <h2>{item.title}</h2>
                          <p className="news-excerpt">{item.excerpt}</p>
                          <span className="read-more">Baca selengkapnya</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <nav className="pagination" aria-label="Pagination">
                    <ul>
                      <li>
                        <button 
                          onClick={() => paginate(currentPage - 1)} 
                          disabled={currentPage === 1}
                          aria-label="Halaman sebelumnya"
                          className="pagination-arrow"
                        >
                          &laquo;
                        </button>
                      </li>
                      {paginationItems}
                      <li>
                        <button 
                          onClick={() => paginate(currentPage + 1)} 
                          disabled={currentPage === totalPages}
                          aria-label="Halaman berikutnya"
                          className="pagination-arrow"
                        >
                          &raquo;
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </>
            ) : (
              <div className="no-results">
                <h2>Tidak ada berita ditemukan</h2>
                <p>Coba ubah filter atau kata kunci pencarian Anda.</p>
                <button className="reset-filters-button" onClick={handleClearFilters}>
                  Hapus semua filter
                </button>
              </div>
            )}
          </div>
          
          {/* Right Sidebar */}
          <div className="news-sidebar-right">
            <div className="sidebar-section">
              <h2>Berita Terbaru</h2>
              <div className="latest-news-list">
                {newsItems.slice(0, 3).map(item => (
                  <div key={item.id} className="latest-news-item">
                    <Link to={`/berita/${item.slug}`} className="latest-news-link">
                      <div className="latest-news-image">
                        <img src={item.image} alt={item.title} loading="lazy" />
                      </div>
                      <div className="latest-news-info">
                        <h3>{item.title}</h3>
                        <span className="latest-news-date">
                          <FaCalendarAlt /> {item.date}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="sidebar-section newsletter-section">
              <h2>Berlangganan Newsletter</h2>
              <p>Dapatkan update terbaru dari reikidevs langsung ke email Anda.</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Email Anda" required aria-label="Email Anda" />
                <button type="submit" className="newsletter-submit">Berlangganan</button>
              </form>
              <p className="newsletter-privacy">
                Kami menghargai privasi Anda. Lihat <a href="/privacy-policy">kebijakan privasi</a> kami.
              </p>
            </div>
            
            <div className="sidebar-section">
              <h2>Ikuti Kami</h2>
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
      <BackToTop />
      
      {/* Mobile filter overlay */}
      <div className={`mobile-filter-overlay ${showMobileFilters ? 'active' : ''}`} onClick={toggleMobileFilters}></div>
    </div>
  );
}

export default NewsList;