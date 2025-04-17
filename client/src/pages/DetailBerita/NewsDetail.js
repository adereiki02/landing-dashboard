import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { FaCalendarAlt, FaUser, FaFolder, FaClock, FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp, FaEye, FaTag } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import BackToTop from '../../components/common/BackToTop';
import { getImageUrl } from '../../utils/imageUtils';
import '../../styles/BackToTop.css';
import '../../styles/NewsDetail.css';

// Data dummy berita - fallback if API fails
const newsItems = [
  {
    id: 1,
    title: "Peluncuran Website Baru BPBD Jawa Tengah",
    date: "15 Juni 2023",
    excerpt: "reikidevs berhasil meluncurkan website baru untuk Badan Penanggulangan Bencana Daerah (BPBD) Jawa Tengah dengan fitur pelaporan bencana real-time.",
    image: "https://images.unsplash.com/photo-1593642532400-2682810df593?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Proyek Terbaru",
    slug: "peluncuran-website-baru-bpbd-jawa-tengah",
    content: `<p>reikidevs dengan bangga mengumumkan peluncuran website baru untuk Badan Penanggulangan Bencana Daerah (BPBD) Jawa Tengah. Website ini dirancang dengan fokus pada kemudahan akses informasi dan pelaporan bencana secara real-time oleh masyarakat.</p>

<p>Fitur utama dari website baru ini meliputi:</p>
<ul>
  <li>Sistem pelaporan bencana yang terintegrasi dengan GPS</li>
  <li>Peta interaktif untuk melihat titik-titik bencana</li>
  <li>Informasi cuaca dan peringatan dini</li>
  <li>Portal edukasi kebencanaan</li>
  <li>Dashboard admin untuk pengelolaan data</li>
</ul>

<p>Proyek ini merupakan hasil kolaborasi antara reikidevs dengan tim IT BPBD Jawa Tengah selama 6 bulan. Dengan adanya website baru ini, diharapkan koordinasi penanganan bencana dapat lebih cepat dan efektif.</p>

<p>"Kami sangat puas dengan hasil kerja reikidevs. Website baru ini tidak hanya menarik secara visual, tetapi juga fungsional dan mudah digunakan oleh masyarakat maupun petugas kami," ujar Kepala BPBD Jawa Tengah.</p>`,
    tags: ["Website", "Pemerintahan", "Bencana Alam"]
  },
  {
    id: 2,
    title: "Aplikasi Antrian Digital untuk Rumah Sakit",
    date: "3 Mei 2023",
    excerpt: "Sistem antrian digital yang dikembangkan oleh reikidevs kini telah diimplementasikan di 5 rumah sakit besar di Indonesia.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Inovasi",
    slug: "aplikasi-antrian-digital-untuk-rumah-sakit",
    content: `<p>Sistem antrian digital yang dikembangkan oleh reikidevs kini telah berhasil diimplementasikan di 5 rumah sakit besar di Indonesia. Inovasi ini bertujuan untuk mengurangi kepadatan dan waktu tunggu pasien di rumah sakit.</p>

<p>Aplikasi antrian digital ini memiliki beberapa keunggulan:</p>
<ul>
  <li>Pendaftaran online melalui aplikasi mobile</li>
  <li>Notifikasi real-time tentang estimasi waktu tunggu</li>
  <li>Integrasi dengan sistem rekam medis rumah sakit</li>
  <li>Dashboard analitik untuk manajemen rumah sakit</li>
  <li>Fitur feedback pasien</li>
</ul>

<p>Berdasarkan data awal, implementasi sistem ini telah berhasil mengurangi waktu tunggu pasien hingga 40% dan meningkatkan efisiensi pelayanan rumah sakit.</p>

<p>"Ini adalah langkah besar dalam digitalisasi layanan kesehatan di Indonesia. Kami berharap dapat memperluas implementasi sistem ini ke lebih banyak fasilitas kesehatan di seluruh Indonesia," kata CEO reikidevs.</p>`,
    tags: ["Aplikasi", "Kesehatan", "Inovasi Digital"]
  },
  {
    id: 3,
    title: "reikidevs Raih Penghargaan Top Digital Agency 2023",
    date: "20 April 2023",
    excerpt: "reikidevs berhasil meraih penghargaan sebagai Top Digital Agency 2023 dalam ajang Indonesia Digital Awards.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Penghargaan",
    slug: "reikidevs-raih-penghargaan-top-digital-agency-2023",
    content: `<p>reikidevs berhasil meraih penghargaan bergengsi sebagai Top Digital Agency 2023 dalam ajang Indonesia Digital Awards yang diselenggarakan di Jakarta pada tanggal 18 April 2023.</p>

<p>Penghargaan ini diberikan berdasarkan penilaian terhadap:</p>
<ul>
  <li>Kualitas dan inovasi proyek digital</li>
  <li>Kepuasan klien</li>
  <li>Kontribusi terhadap perkembangan industri digital di Indonesia</li>
  <li>Praktik bisnis yang berkelanjutan</li>
</ul>

<p>reikidevs berhasil unggul dari lebih dari 50 agensi digital lainnya yang masuk dalam nominasi. Proyek-proyek unggulan yang menjadi pertimbangan dewan juri termasuk website BPBD Jawa Tengah dan sistem antrian digital untuk rumah sakit.</p>

<p>"Penghargaan ini merupakan bukti kerja keras dan dedikasi seluruh tim reikidevs dalam menghadirkan solusi digital terbaik bagi klien kami. Kami berkomitmen untuk terus berinovasi dan memberikan layanan berkualitas tinggi," ujar Direktur reikidevs saat menerima penghargaan tersebut.</p>`,
    tags: ["Penghargaan", "Digital Agency", "Prestasi"]
  },
  {
    id: 4,
    title: "Workshop Digital Marketing untuk UKM",
    date: "10 Maret 2023",
    excerpt: "reikidevs mengadakan workshop digital marketing gratis untuk membantu UKM meningkatkan presence online mereka.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Event",
    slug: "workshop-digital-marketing-untuk-ukm",
    content: `<p>Sebagai bagian dari program tanggung jawab sosial perusahaan, reikidevs mengadakan workshop digital marketing gratis untuk para pelaku Usaha Kecil dan Menengah (UKM) di Jakarta pada tanggal 8 Maret 2023.</p>

<p>Workshop yang dihadiri oleh lebih dari 100 pelaku UKM ini membahas berbagai topik penting:</p>
<ul>
  <li>Dasar-dasar digital marketing</li>
  <li>Strategi media sosial untuk bisnis kecil</li>
  <li>Optimasi SEO untuk website bisnis</li>
  <li>Pemanfaatan marketplace</li>
  <li>Analisis data untuk pengambilan keputusan bisnis</li>
</ul>

<p>Para peserta juga mendapatkan konsultasi one-on-one dengan tim ahli reikidevs untuk membahas strategi digital yang sesuai dengan bisnis mereka.</p>

<p>"Kami percaya bahwa digitalisasi adalah kunci untuk membantu UKM bertahan dan berkembang di era modern ini. Workshop ini adalah bentuk kontribusi kami untuk mendukung pertumbuhan ekonomi lokal," kata Manajer Marketing reikidevs.</p>

<p>Berdasarkan feedback peserta, workshop ini mendapatkan rating kepuasan 4.8 dari 5. reikidevs berencana untuk mengadakan workshop serupa di kota-kota lain di Indonesia dalam beberapa bulan ke depan.</p>`,
    tags: ["Workshop", "Digital Marketing", "UKM", "Event"]
  }
];

// Generate structured data for a news article
const generateNewsStructuredData = (news) => {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": news.title,
    "image": [
      news.featuredImage || news.image
    ],
    "datePublished": news.createdAt || new Date(news.date).toISOString(),
    "dateModified": news.updatedAt || new Date(news.date).toISOString(),
    "author": {
      "@type": "Person",
      "name": news.author?.name || "Admin reikidevs",
      "url": "https://reikidevs.com/team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "reikidevs",
      "logo": {
        "@type": "ImageObject",
        "url": "https://reikidevs.com/logo.png"
      }
    },
    "description": news.excerpt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://reikidevs.com/berita/${news.slug || news.id}`
    }
  };
};

// Estimate reading time
const calculateReadingTime = (content) => {
  // Strip HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  // Average reading speed: 200 words per minute
  const words = text.split(/\s+/).length;
  const readingTime = Math.ceil(words / 200);
  return readingTime;
};

// Get related articles based on category and tags
const getRelatedArticles = (currentNews, allNews, limit = 3) => {
  // First try to match by both category and tags
  if (currentNews.tags && currentNews.tags.length > 0) {
    const byTagAndCategory = allNews.filter(news => 
      news.id !== currentNews.id && 
      news.category === currentNews.category &&
      news.tags && news.tags.some(tag => currentNews.tags.includes(tag))
    );
    
    if (byTagAndCategory.length >= limit) {
      return byTagAndCategory.slice(0, limit);
    }
    
    // If not enough, add some by tag only
    const byTagOnly = allNews.filter(news => 
      news.id !== currentNews.id && 
      news.category !== currentNews.category &&
      news.tags && news.tags.some(tag => currentNews.tags.includes(tag))
    );
    
    const combined = [...byTagAndCategory, ...byTagOnly];
    if (combined.length >= limit) {
      return combined.slice(0, limit);
    }
  }
  
  // Fallback to category only
  return allNews
    .filter(news => news.id !== currentNews.id && news.category === currentNews.category)
    .slice(0, limit);
};

function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readingTime, setReadingTime] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Add scroll event listener
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        
        // Show navbar when scrolling up or at the top
        if (currentScrollY < lastScrollY || currentScrollY < 100) {
          setShowNavbar(true);
        } 
        // Hide navbar when scrolling down and not at the top
        else if (currentScrollY > 100 && currentScrollY > lastScrollY) {
          setShowNavbar(false);
        }
        
        // Show/hide back to top button
        if (currentScrollY > 300) {
          setShowBackToTop(true);
        } else {
          setShowBackToTop(false);
        }
        
        // Update the last scroll position
        setLastScrollY(currentScrollY);
      };
      
      window.addEventListener('scroll', handleScroll);
      
      // Cleanup the event listener
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [lastScrollY]);

  // Share functionality
  const shareUrl = `https://reikidevs.com/berita/${news?.slug || id}`;
  const shareTitle = news?.title;
  
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };
  
  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank');
  };
  
  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };
  
  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`, '_blank');
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        
        // First try to fetch from API using slug
        const response = await axios.get(`/api/news/slug/${id}`);
        setNews(response.data);
        setViewCount(response.data.views || 0);
        
        // Calculate reading time
        if (response.data.content) {
          setReadingTime(calculateReadingTime(response.data.content));
        }
        
        // Fetch related news
        try {
          const allNewsResponse = await axios.get('/api/news');
          const related = getRelatedArticles(response.data, allNewsResponse.data.news);
          setRelatedNews(related);
        } catch (err) {
          console.error('Error fetching related news:', err);
          // Use fallback for related news
          const related = getRelatedArticles(response.data, newsItems);
          setRelatedNews(related);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news by slug:', error);
        
        try {
          // If slug fails, try by ID (if it's a valid MongoDB ID)
          if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const idResponse = await axios.get(`/api/news/${id}`);
            setNews(idResponse.data);
            setViewCount(idResponse.data.views || 0);
            
            // Calculate reading time
            if (idResponse.data.content) {
              setReadingTime(calculateReadingTime(idResponse.data.content));
            }
            
            // Fetch related news
            try {
              const allNewsResponse = await axios.get('/api/news');
              const related = getRelatedArticles(idResponse.data, allNewsResponse.data.news);
              setRelatedNews(related);
            } catch (err) {
              console.error('Error fetching related news:', err);
              // Use fallback for related news
              const related = getRelatedArticles(idResponse.data, newsItems);
              setRelatedNews(related);
            }
            
            setLoading(false);
          } else {
            // If not a valid MongoDB ID, try fallback data
            const foundNews = newsItems.find(item => 
              item.slug === id || item.id === parseInt(id)
            );
            
            if (foundNews) {
              setNews(foundNews);
              setViewCount(foundNews.views || Math.floor(Math.random() * 100) + 50); // Random views for demo
              
              // Calculate reading time
              if (foundNews.content) {
                setReadingTime(calculateReadingTime(foundNews.content));
              }
              
              // Get related news from fallback data
              const related = getRelatedArticles(foundNews, newsItems);
              setRelatedNews(related);
            } else {
              setError('Berita tidak ditemukan');
            }
            setLoading(false);
          }
        } catch (err) {
          console.error('Error fetching news by ID:', err);
          
          // Final fallback to static data
          const foundNews = newsItems.find(item => 
            item.slug === id || item.id === parseInt(id)
          );
          
          if (foundNews) {
            setNews(foundNews);
            setViewCount(foundNews.views || Math.floor(Math.random() * 100) + 50); // Random views for demo
            
            // Calculate reading time
            if (foundNews.content) {
              setReadingTime(calculateReadingTime(foundNews.content));
            }
            
            // Get related news from fallback data
            const related = getRelatedArticles(foundNews, newsItems);
            setRelatedNews(related);
          } else {
            setError('Berita tidak ditemukan');
          }
          setLoading(false);
        }
      }
    };
    
    fetchNews();
    // Scroll to top when navigating to a new article
    window.scrollTo(0, 0);
    
    // Increment view count
    const incrementViewCount = async () => {
      try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          await axios.post(`/api/news/${id}/view`);
        }
      } catch (error) {
        console.error('Error incrementing view count:', error);
      }
    };
    
    incrementViewCount();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <Helmet>
          <title>Memuat Berita... - reikidevs</title>
        </Helmet>
        <div className="loading-spinner"></div>
        <p>Memuat berita...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Helmet>
          <title>Error - reikidevs</title>
        </Helmet>
        <h2>Oops! Terjadi kesalahan</h2>
        <p>{error}</p>
        <Link to="/berita" className="back-to-news">
          <span aria-hidden="true">←</span> Kembali ke Daftar Berita
        </Link>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="not-found-container">
        <Helmet>
          <title>Berita Tidak Ditemukan - reikidevs</title>
        </Helmet>
        <h2>Berita Tidak Ditemukan</h2>
        <p>Maaf, berita yang Anda cari tidak ditemukan.</p>
        <Link to="/berita" className="back-to-news">
          <span aria-hidden="true">←</span> Kembali ke Daftar Berita
        </Link>
      </div>
    );
  }

  return (
    <div className="news-detail-page">
      <Helmet>
        <title>{news.title} - reikidevs</title>
        <meta name="description" content={news.excerpt} />
        <meta property="og:title" content={news.title} />
        <meta property="og:description" content={news.excerpt} />
        <meta property="og:image" content={getImageUrl(news.featuredImage || news.image, 'news')} />
        <meta property="og:url" content={`https://reikidevs.com/berita/${news.slug || news.id}`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(generateNewsStructuredData(news))}
        </script>
      </Helmet>
      
      <Navbar visible={showNavbar} />
      
      <div className="news-detail-container">
        <article className="news-article">
          <header className="news-header">
            <h1>{news.title}</h1>
            
            <div className="news-meta">
              <div className="news-meta-item">
                <FaCalendarAlt aria-hidden="true" />
                <time dateTime={news.createdAt ? new Date(news.createdAt).toISOString() : new Date(news.date).toISOString()}>
                  {news.createdAt ? formatDate(news.createdAt) : news.date}
                </time>
              </div>
              
              {news.author && (
                <div className="news-meta-item">
                  <FaUser aria-hidden="true" />
                  <span>{news.author.name || "Admin reikidevs"}</span>
                </div>
              )}
              
              <div className="news-meta-item">
                <FaFolder aria-hidden="true" />
                <span>{news.category}</span>
              </div>
              
              <div className="news-meta-item">
                <FaClock aria-hidden="true" />
                <span>{readingTime} menit membaca</span>
              </div>
              
              <div className="news-meta-item">
                <FaEye aria-hidden="true" />
                <span>{viewCount} kali dilihat</span>
              </div>
            </div>
          </header>
          
          <div className="featured-image-container">
            <img 
              src={getImageUrl(news.featuredImage || news.image, 'news')} 
              alt={news.title} 
              className="featured-image"
              loading="lazy"
              width="800"
              height="450"
            />
          </div>
          
          <div className="news-content" dangerouslySetInnerHTML={{ __html: news.content }} />
          
          {news.tags && news.tags.length > 0 && (
            <div className="news-tags">
              <FaTag aria-hidden="true" />
              <span className="sr-only">Tags:</span>
              <ul className="tags-list">
                {news.tags.map((tag, index) => (
                  <li key={index}>
                    <Link to={`/berita/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}>{tag}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="news-share">
            <h3>Bagikan Berita Ini:</h3>
            <div className="share-buttons">
              <button onClick={shareOnFacebook} aria-label="Bagikan ke Facebook">
                <FaFacebookF aria-hidden="true" />
              </button>
              <button onClick={shareOnTwitter} aria-label="Bagikan ke Twitter">
                <FaTwitter aria-hidden="true" />
              </button>
              <button onClick={shareOnLinkedIn} aria-label="Bagikan ke LinkedIn">
                <FaLinkedinIn aria-hidden="true" />
              </button>
              <button onClick={shareOnWhatsApp} aria-label="Bagikan ke WhatsApp">
                <FaWhatsapp aria-hidden="true" />
              </button>
            </div>
          </div>
        </article>
        
        {relatedNews.length > 0 && (
          <section className="related-news">
            <h2>Berita Terkait</h2>
            <div className="related-news-grid">
              {relatedNews.map((item) => (
                <article key={item.id || `related-${item.slug}`} className="related-news-item">
                  <Link to={`/berita/${item.slug || item.id}`} onClick={() => window.scrollTo(0, 0)}>
                    <div className="related-news-image">
                      <img 
                        src={getImageUrl(item.featuredImage || item.image, 'news')} 
                        alt={item.title} 
                        className="related-image"
                        loading="lazy" 
                        width="400" 
                        height="225"
                      />
                    </div>
                    <div className="related-news-content">
                      <h3>{item.title}</h3>
                      <div className="related-news-meta">
                        <time dateTime={item.createdAt ? new Date(item.createdAt).toISOString() : new Date(item.date).toISOString()}>
                          <FaCalendarAlt aria-hidden="true" /> {item.createdAt ? formatDate(item.createdAt) : item.date}
                        </time>
                        {item.category && (
                          <span className="related-news-category">
                            <FaFolder aria-hidden="true" /> {item.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
        
        <div className="news-navigation">
          <Link to="/berita" className="back-to-news">
            <span aria-hidden="true">←</span> Kembali ke Daftar Berita
          </Link>
        </div>
      </div>
      
      <BackToTop />
      <Footer />

      {/* Back to Top Button */}
      {showBackToTop && (
        <button 
          className="back-to-top-btn" 
          onClick={scrollToTop}
          aria-label="Kembali ke atas"
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default NewsDetail;