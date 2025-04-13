import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import '../../styles/NewsDetail.css';

// Menggunakan data berita yang sama dengan NewsList
const newsItems = [
  {
    id: 1,
    title: "Peluncuran Website Baru BPBD Jawa Tengah",
    date: "15 Juni 2023",
    excerpt: "reikidevs berhasil meluncurkan website baru untuk Badan Penanggulangan Bencana Daerah (BPBD) Jawa Tengah dengan fitur pelaporan bencana real-time.",
    image: "https://images.unsplash.com/photo-1593642532400-2682810df593?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Proyek Terbaru",
    author: "Tim reikidevs",
    content: `<p>reikidevs dengan bangga mengumumkan peluncuran website baru untuk Badan Penanggulangan Bencana Daerah (BPBD) Jawa Tengah. Website ini dirancang dengan fokus pada kemudahan akses informasi dan pelaporan bencana secara real-time oleh masyarakat.</p>

<p>Fitur utama dari website ini meliputi:</p>

<ul>
  <li>Sistem pelaporan bencana yang terintegrasi dengan GPS</li>
  <li>Peta interaktif sebaran bencana di Jawa Tengah</li>
  <li>Informasi cuaca dan peringatan dini</li>
  <li>Panduan evakuasi dan penanganan bencana</li>
  <li>Portal berita terkait kebencanaan</li>
</ul>

<p>Website ini dibangun menggunakan teknologi terkini dengan memperhatikan aspek responsif sehingga dapat diakses dengan baik melalui berbagai perangkat, baik desktop maupun mobile.</p>

<p>"Kami berharap website ini dapat menjadi jembatan komunikasi yang efektif antara masyarakat dan BPBD Jawa Tengah dalam upaya mitigasi dan penanganan bencana," ujar Direktur reikidevs.</p>

<p>Selain itu, website ini juga dilengkapi dengan dashboard admin yang komprehensif untuk memudahkan pengelolaan data dan respons cepat terhadap laporan bencana yang masuk.</p>

<p>Proyek ini merupakan bagian dari komitmen reikidevs dalam mendukung program pemerintah untuk meningkatkan kesiapsiagaan dan ketahanan masyarakat terhadap bencana.</p>`,
    tags: ["BPBD", "website", "bencana", "Jawa Tengah", "teknologi"],
    relatedPosts: [2, 4]
  },
  {
    id: 2,
    title: "Aplikasi Antrian Digital untuk Rumah Sakit",
    date: "3 Mei 2023",
    excerpt: "Sistem antrian digital yang dikembangkan oleh reikidevs kini telah diimplementasikan di 5 rumah sakit besar di Indonesia.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Inovasi",
    author: "Budi Santoso",
    content: `<p>reikidevs berhasil mengembangkan sistem antrian digital yang kini telah diimplementasikan di 5 rumah sakit besar di Indonesia. Sistem ini dirancang untuk mengatasi masalah antrian panjang dan waktu tunggu yang lama di rumah sakit.</p>

<p>Aplikasi antrian digital ini memiliki beberapa keunggulan, di antaranya:</p>

<ul>
  <li>Pendaftaran online melalui aplikasi mobile</li>
  <li>Estimasi waktu tunggu yang akurat</li>
  <li>Notifikasi real-time ketika giliran hampir tiba</li>
  <li>Integrasi dengan sistem rekam medis rumah sakit</li>
  <li>Dashboard analitik untuk manajemen rumah sakit</li>
</ul>

<p>"Implementasi sistem antrian digital ini telah berhasil mengurangi waktu tunggu pasien hingga 40% dan meningkatkan efisiensi pelayanan rumah sakit," kata Dr. Andi, Direktur Rumah Sakit Medika.</p>

<p>Sistem ini juga dilengkapi dengan fitur feedback pasien yang memungkinkan rumah sakit untuk terus meningkatkan kualitas pelayanan mereka berdasarkan masukan dari pasien.</p>

<p>reikidevs berencana untuk terus mengembangkan sistem ini dan mengimplementasikannya di lebih banyak rumah sakit di seluruh Indonesia dalam upaya meningkatkan kualitas pelayanan kesehatan nasional.</p>`,
    tags: ["rumah sakit", "antrian digital", "teknologi kesehatan", "inovasi"],
    relatedPosts: [1, 3]
  },
  {
    id: 3,
    title: "reikidevs Raih Penghargaan Top Digital Agency 2023",
    date: "20 April 2023",
    excerpt: "reikidevs berhasil meraih penghargaan sebagai Top Digital Agency 2023 dalam ajang Indonesia Digital Awards.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Penghargaan",
    author: "Dewi Putri",
    content: `<p>reikidevs berhasil meraih penghargaan bergengsi sebagai Top Digital Agency 2023 dalam ajang Indonesia Digital Awards yang diselenggarakan oleh Asosiasi Digital Indonesia.</p>

<p>Penghargaan ini diberikan atas kontribusi dan inovasi reikidevs dalam mengembangkan solusi digital yang berdampak positif bagi masyarakat dan bisnis di Indonesia.</p>

<p>"Kami sangat bangga dan berterima kasih atas penghargaan ini. Ini merupakan bukti kerja keras dan dedikasi seluruh tim reikidevs dalam menghadirkan solusi digital terbaik," ujar CEO reikidevs dalam sambutannya.</p>

<p>Beberapa proyek unggulan yang menjadi pertimbangan dewan juri dalam memberikan penghargaan ini antara lain:</p>

<ul>
  <li>Sistem pelaporan bencana real-time untuk BPBD Jawa Tengah</li>
  <li>Aplikasi antrian digital untuk rumah sakit</li>
  <li>Platform e-learning untuk pendidikan vokasi</li>
  <li>Sistem manajemen rantai pasok untuk UMKM</li>
</ul>

<p>Indonesia Digital Awards merupakan ajang penghargaan tahunan yang bertujuan untuk mengapresiasi individu, perusahaan, dan lembaga yang telah berkontribusi dalam pengembangan ekosistem digital di Indonesia.</p>

<p>Penghargaan ini semakin memotivasi reikidevs untuk terus berinovasi dan mengembangkan solusi digital yang dapat memberikan manfaat nyata bagi masyarakat dan mendukung transformasi digital di Indonesia.</p>`,
    tags: ["penghargaan", "digital agency", "inovasi", "teknologi"],
    relatedPosts: [2, 4]
  },
  {
    id: 4,
    title: "Workshop Digital Marketing untuk UKM",
    date: "10 Maret 2023",
    excerpt: "reikidevs mengadakan workshop digital marketing gratis untuk membantu UKM meningkatkan presence online mereka.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Event",
    author: "Rina Wijaya",
    content: `<p>reikidevs sukses menyelenggarakan workshop digital marketing gratis untuk para pelaku Usaha Kecil dan Menengah (UKM) di Semarang. Workshop yang dihadiri oleh lebih dari 100 peserta ini bertujuan untuk membantu UKM meningkatkan kehadiran online dan strategi pemasaran digital mereka.</p>

<p>Workshop yang berlangsung selama dua hari ini mencakup berbagai topik penting, di antaranya:</p>

<ul>
  <li>Dasar-dasar pemasaran digital</li>
  <li>Optimasi media sosial untuk bisnis</li>
  <li>Strategi content marketing yang efektif</li>
  <li>Dasar-dasar SEO (Search Engine Optimization)</li>
  <li>Analisis data dan pengukuran performa kampanye digital</li>
</ul>

<p>"Kami melihat banyak potensi dari UKM lokal yang belum dimaksimalkan karena keterbatasan pengetahuan tentang pemasaran digital. Workshop ini adalah bentuk kontribusi kami untuk membantu UKM tumbuh dan bersaing di era digital," kata Marketing Director reikidevs.</p>

<p>Para peserta juga mendapatkan kesempatan konsultasi one-on-one dengan para ahli digital marketing dari reikidevs untuk mendiskusikan strategi yang sesuai dengan bisnis mereka.</p>

<p>Berdasarkan survei pasca acara, 92% peserta merasa workshop ini sangat bermanfaat dan memberikan wawasan baru yang dapat langsung diterapkan dalam bisnis mereka.</p>

<p>reikidevs berencana untuk menyelenggarakan workshop serupa di kota-kota lain di Indonesia sebagai bagian dari program tanggung jawab sosial perusahaan.</p>`,
    tags: ["workshop", "digital marketing", "UKM", "event", "pelatihan"],
    relatedPosts: [1, 3]
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

function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Simulate API call to get news detail
    const newsItem = newsItems.find(item => item.id === parseInt(id));
    
    if (newsItem) {
      setNews(newsItem);
      
      // Set page title for SEO
      document.title = `${newsItem.title} - reikidevs`;
      
      // Get related news
      if (newsItem.relatedPosts && newsItem.relatedPosts.length > 0) {
        const related = newsItems.filter(item => newsItem.relatedPosts.includes(item.id));
        setRelatedNews(related);
      }
    }
    
    setLoading(false);
  }, [id]);
  
  if (loading) {
    return (
      <div className="news-detail-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat artikel...</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!news) {
    return (
      <div className="news-detail-page">
        <Navbar />
        <div className="not-found-container">
          <h1>Artikel Tidak Ditemukan</h1>
          <p>Maaf, artikel yang Anda cari tidak ditemukan.</p>
          <Link to="/berita" className="back-button">Kembali ke Daftar Berita</Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="news-detail-page">
      {/* React Helmet for SEO */}
      <Helmet>
        <title>{news.title} - reikidevs</title>
        <meta name="description" content={news.excerpt} />
        <meta property="og:title" content={news.title} />
        <meta property="og:description" content={news.excerpt} />
        <meta property="og:image" content={news.image} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={news.title} />
        <meta name="twitter:description" content={news.excerpt} />
        <meta name="twitter:image" content={news.image} />
        <meta name="keywords" content={news.tags.join(', ')} />
        <link rel="canonical" href={`https://reikidevs.com/berita/${news.id}`} />
      </Helmet>
      
      <Navbar />
      
      <div className="news-detail-hero" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${news.image})` }}>
        <div className="news-detail-hero-content">
          <div className="news-category-badge">{news.category}</div>
          <h1>{news.title}</h1>
          <div className="news-meta">
            <span className="news-author">Oleh: {news.author}</span>
            <span className="news-date">{news.date}</span>
          </div>
        </div>
      </div>
      
      <div className="news-detail-container">
        <div className="news-detail-layout">
          {/* Main Content */}
          <main className="news-detail-content">
            <article className="news-article">
              {/* Article content */}
              <div className="article-content" dangerouslySetInnerHTML={{ __html: news.content }} />
              
              {/* Tags */}
              <div className="article-tags">
                <h3>Tags:</h3>
                <div className="tags-list">
                  {news.tags.map(tag => (
                    <Link key={tag} to={`/berita?tag=${tag}`} className="tag-link">
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Share buttons */}
              <div className="article-share">
                <h3>Bagikan:</h3>
                <div className="share-buttons">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=https://reikidevs.com/berita/${news.id}`} target="_blank" rel="noopener noreferrer" className="share-button facebook">
                    <i className="fab fa-facebook-f"></i> Facebook
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=https://reikidevs.com/berita/${news.id}&text=${news.title}`} target="_blank" rel="noopener noreferrer" className="share-button twitter">
                    <i className="fab fa-twitter"></i> Twitter
                  </a>
                  <a href={`https://www.linkedin.com/shareArticle?mini=true&url=https://reikidevs.com/berita/${news.id}&title=${news.title}&summary=${news.excerpt}`} target="_blank" rel="noopener noreferrer" className="share-button linkedin">
                    <i className="fab fa-linkedin-in"></i> LinkedIn
                  </a>
                  <a href={`https://wa.me/?text=${news.title} https://reikidevs.com/berita/${news.id}`} target="_blank" rel="noopener noreferrer" className="share-button whatsapp">
                    <i className="fab fa-whatsapp"></i> WhatsApp
                  </a>
                </div>
              </div>
              
              {/* Author bio */}
              <div className="author-bio">
                <div className="author-avatar">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(news.author)}&background=random`} alt={news.author} />
                </div>
                <div className="author-info">
                  <h3>{news.author}</h3>
                  <p>Penulis di reikidevs dengan pengalaman dalam bidang teknologi dan pengembangan web. Aktif menulis tentang tren teknologi terbaru dan inovasi digital.</p>
                </div>
              </div>
            </article>
            
            {/* Related articles */}
            {relatedNews.length > 0 && (
              <div className="related-articles">
                <h2>Artikel Terkait</h2>
                <div className="related-articles-grid">
                  {relatedNews.map(item => (
                    <div key={item.id} className="related-article-card">
                      <Link to={`/berita/${item.id}`} className="related-article-link">
                        <div className="related-article-image">
                          <img src={item.image} alt={item.title} />
                          <div className="related-article-category">{item.category}</div>
                        </div>
                        <div className="related-article-content">
                          <h3>{item.title}</h3>
                          <div className="related-article-meta">
                            <span className="related-article-date">{item.date}</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Comments section */}
            <div className="comments-section">
              <h2>Komentar (0)</h2>
              <div className="comment-form">
                <h3>Tinggalkan Komentar</h3>
                <form>
                  <div className="form-group">
                    <label htmlFor="name">Nama</label>
                    <input type="text" id="name" name="name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="comment">Komentar</label>
                    <textarea id="comment" name="comment" rows="5" required></textarea>
                  </div>
                  <button type="submit" className="submit-comment">Kirim Komentar</button>
                </form>
              </div>
            </div>
          </main>
          
          {/* Sidebar */}
          <aside className="news-detail-sidebar">
            {/* Author widget */}
            <div className="sidebar-widget author-widget">
              <h3>Tentang Penulis</h3>
              <div className="author-card">
                <div className="author-avatar">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(news.author)}&background=random`} alt={news.author} />
                </div>
                <div className="author-name">{news.author}</div>
                <p>Penulis di reikidevs dengan pengalaman dalam bidang teknologi dan pengembangan web.</p>
                <div className="author-social">
                  <a href="#" className="author-social-link"><i className="fab fa-twitter"></i></a>
                  <a href="#" className="author-social-link"><i className="fab fa-linkedin-in"></i></a>
                  <a href="#" className="author-social-link"><i className="fab fa-facebook-f"></i></a>
                </div>
              </div>
            </div>
            
            {/* Categories widget */}
            <div className="sidebar-widget categories-widget">
              <h3>Kategori</h3>
              <ul className="categories-list">
                {categories.map(category => (
                  <li key={category}>
                    <Link to={`/berita?category=${category}`} className="category-link">
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Recent posts widget */}
            <div className="sidebar-widget recent-posts-widget">
              <h3>Artikel Terbaru</h3>
              <div className="recent-posts-list">
                {newsItems.slice(0, 4).map(item => (
                  <div key={item.id} className="recent-post-item">
                    <Link to={`/berita/${item.id}`} className="recent-post-link">
                      <div className="recent-post-image">
                        <img src={item.image} alt={item.title} />
                      </div>
                      <div className="recent-post-info">
                        <h4>{item.title}</h4>
                        <span className="recent-post-date">{item.date}</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tags widget */}
            <div className="sidebar-widget tags-widget">
              <h3>Tags</h3>
              <div className="tags-cloud">
                {[...new Set(newsItems.flatMap(item => item.tags))].map(tag => (
                  <Link key={tag} to={`/berita?tag=${tag}`} className="tag-link">
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Archives widget */}
            <div className="sidebar-widget archives-widget">
              <h3>Arsip</h3>
              <ul className="archives-list">
                {archives.map(archive => (
                  <li key={archive}>
                    <Link to={`/berita?archive=${archive}`} className="archive-link">
                      {archive}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Newsletter widget */}
            <div className="sidebar-widget newsletter-widget">
              <h3>Berlangganan Newsletter</h3>
              <p>Dapatkan update terbaru dari reikidevs langsung ke email Anda.</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Email Anda" required />
                <button type="submit">Berlangganan</button>
              </form>
            </div>
          </aside>
        </div>
      </div>
      
      {/* Call to action */}
      <div className="news-detail-cta">
        <div className="cta-content">
          <h2>Butuh Solusi Digital untuk Bisnis Anda?</h2>
          <p>Konsultasikan kebutuhan digital Anda dengan tim ahli kami.</p>
          <Link to="/kontak" className="cta-button">Hubungi Kami</Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default NewsDetail;