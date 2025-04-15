import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/NotFound.css';

const NewsNotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>Berita tidak ditemukan</h1>
        <p>Maaf, berita yang Anda cari tidak tersedia.</p>
        <Link to="/" className="back-home-btn">Kembali ke Beranda</Link>
      </div>
    </div>
  );
};

export default NewsNotFound;