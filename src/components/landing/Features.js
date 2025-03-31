
function Features() {
  const services = [
    {
      id: 1,
      icon: '🌐',
      title: 'Pengembangan Web',
      description: 'Aplikasi web responsif dengan teknologi terkini untuk bisnis Anda.'
    },
    {
      id: 2,
      icon: '🎨',
      title: 'Desain Web',
      description: 'UI/UX menarik yang meningkatkan engagement pengunjung website Anda.'
    },
    {
      id: 3,
      icon: '📊',
      title: 'Optimasi Web SEO',
      description: 'Tingkatkan peringkat website Anda di mesin pencari dengan strategi SEO.'
    },
    {
      id: 4,
      icon: '✏️',
      title: 'Desain Grafis',
      description: 'Desain logo, banner, dan aset visual menarik untuk brand Anda.'
    },
    {
      id: 5,
      icon: '🎬',
      title: 'Videografi',
      description: 'Produksi video promosi dan konten visual untuk pemasaran digital.'
    },
    {
      id: 6,
      icon: '📑',
      title: 'Desain PPT',
      description: 'Presentasi profesional yang membuat pesan bisnis Anda tersampaikan dengan baik.'
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="section-header">
          <h2>Layanan Kami</h2>
          <p>Solusi digital komprehensif untuk kebutuhan bisnis Anda</p>
        </div>
        <div className="services-grid">
          {services.map(service => (
            <div className="service-card" key={service.id}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;