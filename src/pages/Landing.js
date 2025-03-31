import React, { useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Testimonials from '../components/landing/Testimonials';
import Footer from '../components/common/Footer';

function Landing() {
  useEffect(() => {
    document.title = "ReiKiDevs - Solusi IT Terbaik";
  }, []);
  
  return (
    <div className="landing-page">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default Landing;