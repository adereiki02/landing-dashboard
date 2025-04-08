import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import '../../styles/NewsDetail.css';

// Data dummy berita (sama dengan yang di NewsCarousel)
const newsItems = [
  {
    id: 1,
    title: "Peluncuran Website Baru BPBD Jawa Tengah",
    date: "15 Juni 2023",
    excerpt: "reikidevs berhasil meluncurkan website baru untuk Badan Penanggulangan Bencana Daerah (BPBD) Jawa Tengah dengan fitur pelaporan bencana real-time.",
    image: "https://images.unsplash.com/photo-1593642532400-2682810df593?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Proyek Terbaru",
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

<p>"Kami sangat puas dengan hasil kerja reikidevs. Website baru ini tidak hanya menarik secara visual, tetapi juga fungsional dan mudah digunakan oleh masyarakat maupun petugas kami," ujar Kepala BPBD Jawa Tengah.</p>`
  },
  {
    id: 2,
    title: "Aplikasi Antrian Digital untuk Rumah Sakit",
    date: "3 Mei 2023",
    excerpt: "Sistem antrian digital yang dikembangkan oleh reikidevs kini telah diimplementasikan di 5 rumah sakit besar di Indonesia.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Inovasi",
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

<p>"Ini adalah langkah besar dalam digitalisasi layanan kesehatan di Indonesia. Kami berharap dapat memperluas implementasi sistem ini ke lebih banyak fasilitas kesehatan di seluruh Indonesia," kata CEO reikidevs.</p>`
  },
  {
    id: 3,
    title: "reikidevs Raih Penghargaan Top Digital Agency 2023",
    date: "20 April 2023",
    excerpt: "reikidevs berhasil meraih penghargaan sebagai Top Digital Agency 2023 dalam ajang Indonesia Digital Awards.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Penghargaan",
    content: `<p>reikidevs berhasil meraih penghargaan bergengsi sebagai Top Digital Agency 2023 dalam ajang Indonesia Digital Awards yang diselenggarakan di Jakarta pada tanggal 18 April 2023.</p>

<p>Penghargaan ini diberikan berdasarkan penilaian terhadap:</p>
<ul>
  <li>Kualitas dan inovasi proyek digital</li>
  <li>Kepuasan klien</li>
  <li>Kontribusi terhadap perkembangan industri digital di Indonesia</li>
  <li>Praktik bisnis yang berkelanjutan</li>
</ul>

<p>reikidevs berhasil unggul dari lebih dari 50 agensi digital lainnya yang masuk dalam nominasi. Proyek-proyek unggulan yang menjadi pertimbangan dewan juri termasuk website BPBD Jawa Tengah dan sistem antrian digital untuk rumah sakit.</p>

<p>"Penghargaan ini merupakan bukti kerja keras dan dedikasi seluruh tim reikidevs dalam menghadirkan solusi digital terbaik bagi klien kami. Kami berkomitmen untuk terus berinovasi dan memberikan layanan berkualitas tinggi," ujar Direktur reikidevs saat menerima penghargaan tersebut.</p>`
  },
  {
    id: 4,
    title: "Workshop Digital Marketing untuk UKM",
    date: "10 Maret 2023",
    excerpt: "reikidevs mengadakan workshop digital marketing gratis untuk membantu UKM meningkatkan presence online mereka.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Event",
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

<p>Berdasarkan feedback peserta, workshop ini mendapatkan rating kepuasan 4.8 dari 5. reikidevs berencana untuk mengadakan workshop serupa di kota-kota lain di Indonesia dalam beberapa bulan ke depan.</p>`
  }
];

function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi fetch data
    setTimeout(() => {
      const foundNews = newsItems.find(item => item.id === parseInt(id));
      setNews(foundNews || null);
      setLoading(false);
    }, 500);
  }, [id]);

  useEffect(() => {
    if (news) {
      document.title = `${news.title} - reikidevs`;
    } else {
      document.title = "Berita - reikidevs";
    }
  }, [news]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Memuat berita...</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="news-not-found">
        <h2>Berita tidak ditemukan</h2>
        <p>Maaf, berita yang Anda cari tidak tersedia.</p>
        <Link to="/" className="back-link">Kembali ke Beranda</Link>
      </div>
    );
  }

  return (
    <div className="news-detail-page">
      <Navbar />
      
      <div className="news-detail-container">
        <div className="news-detail-header">
          <div className="news-category-badge">{news.category}</div>
          <h1>{news.title}</h1>
          <div className="news-meta">
            <span className="news-date">{news.date}</span>
          </div>
        </div>
        
        <div className="news-detail-image">
          <img src={news.image} alt={news.title} />
        </div>
        
        <div className="news-detail-content" dangerouslySetInnerHTML={{ __html: news.content }} />
        
        <div className="news-navigation">
          <Link to="/" className="back-to-home">← Kembali ke Beranda</Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default NewsDetail;