import React from 'react';

function Features() {
  return (
    <section id="features" className="features">
      <h2>Fitur Unggulan</h2>
      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-icon">🚀</div>
          <h3>Cepat</h3>
          <p>Proses data dengan cepat dan efisien</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Aman</h3>
          <p>Keamanan data terjamin</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Analitik</h3>
          <p>Visualisasi data yang informatif</p>
        </div>
      </div>
    </section>
  );
}

export default Features;