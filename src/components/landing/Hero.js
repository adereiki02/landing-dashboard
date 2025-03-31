import Button from '../common/Button';

function Hero() {
  const scrollToFeatures = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1>Selamat Datang di <span>ReiKiDevs</span></h1>
          <h2>Kerjasama dan Solusi IT Terbaik untuk Anda!</h2>
          <p>
            Kami menyediakan layanan pengembangan web, desain grafis, dan solusi digital
            yang akan membantu bisnis Anda tumbuh di era digital.
          </p>
          <Button className="cta-button" onClick={scrollToFeatures}>
            Jelajahi Layanan Kami
          </Button>
        </div>
        <div className="hero-image">
          <div className="hero-image-placeholder">
            <div className="hero-graphic"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;