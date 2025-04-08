import React, { useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import NewsCarousel from '../components/landing/NewsCarousel';
import Testimonials from '../components/landing/Testimonials';
import Footer from '../components/common/Footer';

function Landing() {
  useEffect(() => {
    document.title = "reikidevs - Solusi IT Terbaik";
  }, []);
  
  return (
    <div className="landing-page">
      <Navbar />
      <Hero />
      <Features />
      <NewsCarousel />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default Landing;