import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">Brand Logo</div>
      <ul className="nav-links">
        <li><a href="#features">Fitur</a></li>
        <li><a href="#testimonials">Testimonial</a></li>
        <li><a href="#contact">Kontak</a></li>
        <li><Link to="/dashboard" className="btn btn-primary">Dashboard</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;