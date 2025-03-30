import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Selamat Datang di Aplikasi Kami</h1>
        <p>Solusi terbaik untuk kebutuhan Anda</p>
        <Link to="/dashboard" className="btn btn-large">Mulai Sekarang</Link>
      </div>
      <div className="hero-image">
        <img src="/images/hero-image.svg" alt="Hero" />
      </div>
    </section>
  );
}

export default Hero;