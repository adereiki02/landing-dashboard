import React from 'react';
import '../../styles/PriceSection.css';

function PriceSection() {
  return (
    <section id="price" className="services-section">
      <div className="container">
        <div className="section-title">
          <h2>Paket Layanan Pembuatan Aplikasi Website</h2>
          <p>Kami menawarkan berbagai paket layanan pembuatan website yang dapat disesuaikan dengan kebutuhan dan anggaran Anda. Pilih paket yang paling sesuai untuk mengembangkan bisnis Anda.</p>
        </div>

        <div className="price-grid">
          {/* Baris 1: Paket Dasar */}
          <div className="price-row">
            {/* Paket 0: Website Undangan Digital */}
            <div className="price-card">
              <div className="package-card">
                <div className="package-header">
                  <h3 className="package-name">Paket Undangan Digital</h3>
                  <div className="price-tag">
                    <div className="discount-badge">50% OFF</div>
                    <div className="package-price">
                      <span className="old-price">Rp 99.000</span>
                      <span className="current-price">Rp 49.000</span>
                    </div>
                  </div>
                  <div className="package-subtitle">Website undangan pernikahan/lamaran digital</div>
                </div>
                <div className="package-features">
                  <ul>
                    <li><i className="fas fa-check-circle"></i> Desain menarik dan responsif</li>
                    <li><i className="fas fa-check-circle"></i> Informasi acara lengkap</li>
                    <li><i className="fas fa-check-circle"></i> Galeri foto pasangan</li>
                    <li><i className="fas fa-check-circle"></i> Peta lokasi acara</li>
                    <li><i className="fas fa-check-circle"></i> RSVP online</li>
                    <li><i className="fas fa-check-circle"></i> Ucapan dan doa dari tamu</li>
                    <li><i className="fas fa-check-circle"></i> Domain gratis selama 1 tahun</li>
                    <li><i className="fas fa-check-circle"></i> Hosting selama 1 tahun</li>
                  </ul>
                </div>
                <div className="package-button">
                  <a href="#contact" className="btn-package">Pesan Sekarang</a>
                </div>
              </div>
            </div>

            {/* Paket 1: Website Sederhana untuk Branding */}
            <div className="price-card">
              <div className="package-card">
                <div className="package-header">
                  <h3 className="package-name">Paket UMKM</h3>
                  <div className="price-tag">
                    <div className="discount-badge">40% OFF</div>
                    <div className="package-price">
                      <span className="old-price">Rp 500.000</span>
                      <span className="current-price">Rp 299.000</span>
                    </div>
                  </div>
                  <div className="package-subtitle">Website sederhana untuk branding (cocok untuk UMKM)</div>
                </div>
                <div className="package-features">
                  <ul>
                    <li><i className="fas fa-check-circle"></i> Desain profesional dan responsif</li>
                    <li><i className="fas fa-check-circle"></i> Hingga 5 halaman website</li>
                    <li><i className="fas fa-check-circle"></i> Optimasi SEO dasar</li>
                    <li><i className="fas fa-check-circle"></i> Integrasi media sosial</li>
                    <li><i className="fas fa-check-circle"></i> Formulir kontak</li>
                    <li><i className="fas fa-check-circle"></i> Galeri produk/portofolio</li>
                    <li><i className="fas fa-check-circle"></i> Domain gratis selama 1 tahun</li>
                    <li><i className="fas fa-check-circle"></i> Hosting selama 1 tahun</li>
                    <li><i className="fas fa-check-circle"></i> Pelatihan dasar pengelolaan website</li>
                  </ul>
                </div>
                <div className="package-button">
                  <a href="#contact" className="btn-package">Pesan Sekarang</a>
                </div>
              </div>
            </div>

            {/* Paket 2: Website Menengah Landing Page */}
            <div className="price-card">
              <div className="package-card highlight-package">
                <div className="highlight-badge">POPULER</div>
                <div className="package-header">
                  <h3 className="package-name">Paket Bisnis</h3>
                  <div className="price-tag">
                    <div className="discount-badge">25% OFF</div>
                    <div className="package-price">
                      <span className="old-price">Rp 2.000.000</span>
                      <span className="current-price">Rp 1.499.999</span>
                    </div>
                  </div>
                  <div className="package-subtitle">Website menengah landing page untuk perusahaan dan sekolah</div>
                </div>
                <div className="package-features">
                  <ul>
                    <li><i className="fas fa-check-circle"></i> Desain premium dan responsif</li>
                    <li><i className="fas fa-check-circle"></i> Hingga 10 halaman website</li>
                    <li><i className="fas fa-check-circle"></i> Optimasi SEO menengah</li>
                    <li><i className="fas fa-check-circle"></i> Integrasi media sosial lengkap</li>
                    <li><i className="fas fa-check-circle"></i> Sistem blog sederhana</li>
                    <li><i className="fas fa-check-circle"></i> Formulir kontak dan pendaftaran</li>
                    <li><i className="fas fa-check-circle"></i> Galeri produk/portofolio interaktif</li>
                    <li><i className="fas fa-check-circle"></i> Integrasi Google Maps</li>
                    <li><i className="fas fa-check-circle"></i> Domain dan hosting premium 1 tahun</li>
                    <li><i className="fas fa-check-circle"></i> Pelatihan pengelolaan website</li>
                    <li><i className="fas fa-check-circle"></i> Support teknis 3 bulan</li>
                  </ul>
                </div>
                <div className="package-button">
                  <a href="#contact" className="btn-package">Pesan Sekarang</a>
                </div>
              </div>
            </div>
          </div>

          {/* Baris 2: Paket Premium */}
          <div className="price-row premium-row">
            {/* Paket 3: Website Manajemen Sistem */}
            <div className="price-card wide-card">
              <div className="package-card premium-card">
                <div className="package-header">
                  <h3 className="package-name">Paket Manajemen Sistem</h3>
                  <div className="price-tag">
                    <div className="package-price-range">Mulai Dari <span className="highlight-price">Rp 3 Juta</span></div>
                  </div>
                  <div className="package-subtitle">Website dengan sistem manajemen terintegrasi</div>
                </div>
                <div className="package-features two-column-features">
                  <ul>
                    <li><i className="fas fa-check-circle"></i> Semua fitur Paket Bisnis</li>
                    <li><i className="fas fa-check-circle"></i> Sistem manajemen konten (CMS) custom</li>
                    <li><i className="fas fa-check-circle"></i> Dashboard admin lengkap</li>
                    <li><i className="fas fa-check-circle"></i> Manajemen pengguna dan hak akses</li>
                    <li><i className="fas fa-check-circle"></i> Sistem database terintegrasi</li>
                    <li><i className="fas fa-check-circle"></i> Sistem inventori (opsional)</li>
                    <li><i className="fas fa-check-circle"></i> Sistem pendaftaran dan keanggotaan</li>
                    <li><i className="fas fa-check-circle"></i> Integrasi API pihak ketiga</li>
                    <li><i className="fas fa-check-circle"></i> Optimasi performa website</li>
                    <li><i className="fas fa-check-circle"></i> Keamanan website tingkat lanjut</li>
                    <li><i className="fas fa-check-circle"></i> Domain dan hosting premium 1 tahun</li>
                    <li><i className="fas fa-check-circle"></i> Pelatihan pengelolaan sistem</li>
                    <li><i className="fas fa-check-circle"></i> Support teknis 6 bulan</li>
                  </ul>
                </div>
                <div className="package-button">
                  <a href="#contact" className="btn-package">Pesan Sekarang</a>
                </div>
              </div>
            </div>

            {/* Paket 4: Website Premium */}
            <div className="price-card wide-card">
              <div className="package-card premium-card">
                <div className="package-header">
                  <h3 className="package-name">Paket Premium Enterprise</h3>
                  <div className="price-tag">
                    <div className="package-price-range">Mulai Dari <span className="highlight-price">Rp 7 Juta</span></div>
                  </div>
                  <div className="package-subtitle">Solusi website lengkap untuk perusahaan besar</div>
                </div>
                <div className="package-features two-column-features">
                  <ul>
                    <li><i className="fas fa-check-circle"></i> Semua fitur Paket Manajemen Sistem</li>
                    <li><i className="fas fa-check-circle"></i> Landing page premium dengan desain eksklusif</li>
                    <li><i className="fas fa-check-circle"></i> Sistem manajemen konten enterprise</li>
                    <li><i className="fas fa-check-circle"></i> Sistem manajemen keuangan terintegrasi</li>
                    <li><i className="fas fa-check-circle"></i> Analitik bisnis dan laporan real-time</li>
                    <li><i className="fas fa-check-circle"></i> Integrasi dengan sistem ERP</li>
                    <li><i className="fas fa-check-circle"></i> Keamanan tingkat enterprise</li>
                    <li><i className="fas fa-check-circle"></i> Domain dan hosting premium 2 tahun</li>
                    <li><i className="fas fa-check-circle"></i> Pelatihan komprehensif untuk tim</li>
                    <li><i className="fas fa-check-circle"></i> Support teknis prioritas 12 bulan</li>
                  </ul>
                </div>
                <div className="package-button">
                  <a href="#contact" className="btn-package">Pesan Sekarang</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="mb-3">Butuh solusi yang lebih spesifik? Kami siap menyesuaikan paket sesuai kebutuhan Anda.</p>
          <a href="#contact" className="btn btn-outline-primary btn-lg">Konsultasi Gratis</a>
        </div>
      </div>
    </section>
  );
}

export default PriceSection;