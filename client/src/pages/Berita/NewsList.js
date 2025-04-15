import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import BackToTop from '../../components/common/BackToTop';
import '../../styles/NewsList.css';
import '../../styles/BackToTop.css';
import { FaCalendarAlt, FaEye, FaClock, FaSearch, FaTags, FaFolder, FaChevronRight, FaFilter, FaTimes, FaArrowUp, FaExclamationTriangle } from 'react-icons/fa';

// Fungsi untuk memformat tanggal dari format ISO ke format yang lebih mudah dibaca
const formatDate = (isoDate) => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('id-ID', options);
};

// Ekstrak bulan dan tahun dari tanggal berita untuk arsip
const getMonthYear = (isoDate) => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const options = { month: 'long', year: 'numeric' };
  return date.toLocaleDateString('id-ID', options);
};

function NewsList() {
  const [newsItems, setNewsItems] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [archives, setArchives] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [activeArchive, setActiveArchive] = useState('');
  const [activeTags, setActiveTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // SEO-related metadata
  const pageTitle = "Blog reikidevs - Berita Terbaru dan Insight Teknologi";
  const pageDescription = "Temukan berita terbaru, update proyek, dan insight teknologi dari tim reikidevs. Kami berbagi pengetahuan dan pengalaman dalam pengembangan web, mobile, dan solusi digital.";

  // Function to load dummy data (not a Hook)
  const loadDummyData = () => {
    console.log('Using dummy data');
    const dummyNews = [
      {
        id: 1,
        title: "Peluncuran Website Baru BPBD Jawa Tengah",
        createdAt: "2023-06-15T00:00:00.000Z",
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
        createdAt: "2023-05-03T00:00:00.000Z",
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
        createdAt: "2023-04-20T00:00:00.000Z",
        excerpt: "reikidevs berhasil meraih penghargaan sebagai Top Digital Agency 2023 dalam ajang Indonesia Digital Awards.",
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        category: "Penghargaan",
        tags: ["award", "digital agency", "prestasi"],
        author: "Dewi Lestari",
        readingTime: "3 menit",
        views: 1560,
        slug: "reikidevs-raih-penghargaan-top-digital-agency-2023"
      }
    ];
    
    setNewsItems(dummyNews);
    setFilteredNews(dummyNews);
    
    // Extract unique categories
    const uniqueCategories = [...new Set(dummyNews.map(item => item.category))];
    setCategories(uniqueCategories);
    
    // Extract unique tags
    const uniqueTags = [...new Set(dummyNews.flatMap(item => item.tags || []))];
    setAllTags(uniqueTags);
    
    // Extract unique archives (month and year)
    const uniqueArchives = [...new Set(dummyNews.map(item => getMonthYear(item.createdAt)))];
    setArchives(uniqueArchives);
  };

  // Fetch news data from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        try {
          const response = await axios.get('/api/news');
          console.log('API Response:', response.data);
          
          // Check if response.data has a news property (from the API structure)
          const newsData = response.data.news || response.data;
          const news = Array.isArray(newsData) ? newsData : [];
          
          console.log('Processed news data:', news);
          
          if (news.length > 0) {
            setNewsItems(news);
            setFilteredNews(news);
            
            // Extract unique categories
            const uniqueCategories = [...new Set(news.map(item => item.category).filter(Boolean))];
            setCategories(uniqueCategories);
            
            // Extract unique tags
            const uniqueTags = [...new Set(news.flatMap(item => item.tags || []))];
            setAllTags(uniqueTags);
            
            // Extract unique archives (month and year)
            const uniqueArchives = [...new Set(news.map(item => getMonthYear(item.createdAt)).filter(Boolean))];
            setArchives(uniqueArchives);
          } else {
            console.log('No news data found in API response, using dummy data');
            // Jika API mengembalikan array kosong, gunakan data dummy
            loadDummyData();
          }
        } catch (apiError) {
          console.error('API Error:', apiError);
          // Jika API belum tersedia, gunakan data dummy
          loadDummyData();
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Gagal memuat berita. Silakan coba lagi nanti.');
        setIsLoading(false);
        // Pastikan filteredNews adalah array kosong jika terjadi error
        setFilteredNews([]);
      }
    };
    
    fetchNews();
  }, []);

  useEffect(() => {
    document.title = pageTitle;
  }, []);

  useEffect(() => {
    // Skip filtering if news items haven't been loaded yet
    if (!Array.isArray(newsItems) || newsItems.length === 0) return;
    
    // Simulate loading state for better UX
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      let result = [...newsItems]; // Pastikan kita bekerja dengan copy array
      
      // Filter berdasarkan kategori
      if (activeCategory !== 'Semua') {
        result = result.filter(item => item && item.category === activeCategory);
      }
      
      // Filter berdasarkan arsip (bulan & tahun)
      if (activeArchive) {
        result = result.filter(item => item && getMonthYear(item.createdAt) === activeArchive);
      }
      
      // Filter berdasarkan tag
      if (activeTags.length > 0) {
        result = result.filter(item => 
          item && item.tags && activeTags.some(tag => item.tags.includes(tag))
        );
      }
      
      // Filter berdasarkan pencarian
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(item => 
          item && (
            (item.title && item.title.toLowerCase().includes(term)) || 
            (item.excerpt && item.excerpt.toLowerCase().includes(term)) ||
            (item.tags && item.tags.some(tag => tag.toLowerCase().includes(term)))
          )
        );
      }
      
      setFilteredNews(result);
      setCurrentPage(1); // Reset to first page when filters change
      setIsLoading(false);
    }, 400); // Small delay to show loading state
    
    return () => clearTimeout(timer);
  }, [activeCategory, activeArchive, activeTags, searchTerm, newsItems]);

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
  const safeFilteredNews = Array.isArray(filteredNews) ? filteredNews : [];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = safeFilteredNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(safeFilteredNews.length / itemsPerPage);
  
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
                    <span className="category-count">{Array.isArray(newsItems) ? newsItems.length : 0}</span>
                  </button>
                </li>
                {Array.isArray(categories) && categories.map(category => {
                  const count = Array.isArray(newsItems) ? newsItems.filter(item => item && item.category === category).length : 0;
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
                {Array.isArray(archives) && archives.map(archive => {
                  const count = Array.isArray(newsItems) ? newsItems.filter(item => item && getMonthYear(item.createdAt) === archive).length : 0;
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
                {Array.isArray(allTags) && allTags.map(tag => {
                  const count = Array.isArray(newsItems) ? newsItems.filter(item => item && item.tags && item.tags.includes(tag)).length : 0;
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
            ) : error ? (
              <div className="error-state">
                <FaExclamationTriangle className="error-icon" />
                <h2>Terjadi Kesalahan</h2>
                <p>{error}</p>
                <button className="retry-button" onClick={() => window.location.reload()}>
                  Coba Lagi
                </button>
              </div>
            ) : filteredNews.length > 0 ? (
              <>
                <div className="news-results-info">
                  <span>Menampilkan {filteredNews.length} artikel</span>
                </div>
                
                <div className="news-grid">
                  {Array.isArray(currentItems) && currentItems.map(item => (
                    <div key={item._id || item.id} className="news-card">
                      <Link to={`/berita/${item.slug || item._id || item.id}`} className="news-card-link">
                        <div className="news-card-image">
                          <img src={item.featuredImage || item.image} alt={item.title} loading="lazy" />
                          <div className="news-category-badge">
                            <FaFolder /> {item.category}
                          </div>
                        </div>
                        <div className="news-card-content">
                          <div className="news-card-meta">
                            <span className="news-date">
                              <FaCalendarAlt /> {formatDate(item.createdAt) || item.date}
                            </span>
                            <span className="news-views">
                              <FaEye /> {item.viewCount || item.views || 0}
                            </span>
                            <span className="news-reading-time">
                              <FaClock /> {item.readingTime || '5 menit'}
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
                {Array.isArray(newsItems) && newsItems.slice(0, 3).map(item => (
                  <div key={item._id || item.id} className="latest-news-item">
                    <Link to={`/berita/${item.slug || item._id || item.id}`} className="latest-news-link">
                      <div className="latest-news-image">
                        <img src={item.featuredImage || item.image} alt={item.title} loading="lazy" />
                      </div>
                      <div className="latest-news-info">
                        <h3>{item.title}</h3>
                        <span className="latest-news-date">
                          <FaCalendarAlt /> {formatDate(item.createdAt) || item.date}
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