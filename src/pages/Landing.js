import React from 'react';
import Navbar from '../components/common/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import '../styles/Landing.css';

function Landing() {
  return (
    <div className="landing-page">
      <Navbar />
      <Hero />
      <Features />
      <footer className="footer">
        <p>&copy; 2023 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Landing;