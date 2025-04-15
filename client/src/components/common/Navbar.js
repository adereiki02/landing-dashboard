import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoImage from '../../assets/reikidevelop.png'; // Pastikan untuk menyimpan logo di folder assets

function Navbar({ visible = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const isNewsListPage = location.pathname === '/berita';

  useEffect(() => {
    // Check if user is logged in
    // const storedUserInfo = localStorage.getItem('userInfo');
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // For NewsListPage, hide navbar when at top, show when scrolling down
      if (isNewsListPage) {
        if (currentScrollY <= 0) {
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isNewsListPage, lastScrollY]);
  
  // Handle scrolling to section after navigation
  useEffect(() => {
    if (location.pathname === '/' && location.state && location.state.scrollTo) {
      const sectionId = location.state.scrollTo;
      const element = document.getElementById(sectionId);
      
      // Use a small timeout to ensure the page has fully loaded
      const timer = setTimeout(() => {
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [location]);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const scrollToSection = (sectionId) => {
    // Check if we're on the home page
    const isHomePage = location.pathname === '/' || location.pathname === '';
    
    if (!isHomePage) {
      // We're not on the home page, navigate to home page first with a hash
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      // We're on the home page, try to scroll to the section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.warn(`Element with id ${sectionId} not found`);
      }
    }
    
    setMenuOpen(false);
  };

  // Check if current page is login or register
  // const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${visible ? '' : 'navbar-hidden'} ${isNewsListPage && !showNavbar ? 'navbar-hidden' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => scrollToSection('home')} style={{cursor: 'pointer'}}>
          <img src={logoImage} alt="ReiKi Develop Logo" className="logo-image" />
        </div>
        <div className={`menu-icon ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <button onClick={() => scrollToSection('features')}>Layanan</button>
          </li>
          <li className="nav-item">
            <button onClick={() => scrollToSection('news')}>Berita</button>
          </li>
          <li className="nav-item">
            <button onClick={() => scrollToSection('portfolio')}>Portfolio</button>
          </li>
          <li className="nav-item">
            <button onClick={() => scrollToSection('partners')}>Mitra Kerjasama</button>
          </li>
          <li className="nav-item">
            <button onClick={() => scrollToSection('testimonials')}>Testimonial</button>
          </li>
          <li className="nav-item">
            <button onClick={() => scrollToSection('contact')}>Kontak</button>
          </li>
          
          {/* Login/Logout buttons removed to always show guest view */}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;