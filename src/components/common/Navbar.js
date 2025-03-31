import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <span>ReiKi</span>Devs
        </div>
        <div className={`menu-icon ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <button onClick={() => scrollToSection('home')}>Home</button>
          </li>
          <li className="nav-item">
            <button onClick={() => scrollToSection('features')}>Layanan</button>
          </li>
          <li className="nav-item">
            <button onClick={() => scrollToSection('testimonials')}>Testimonial</button>
          </li>
          <li className="nav-item">
            <button onClick={() => scrollToSection('contact')}>Kontak</button>
          </li>
          <li className="nav-item">
            <Link to="/dashboard">
              <Button className="btn-primary">Dashboard</Button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;