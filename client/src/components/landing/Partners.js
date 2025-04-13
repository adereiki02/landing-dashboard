import React from 'react';
import '../../styles/Partners.css';

// Import partner logos
import udinusLogo from '../../assets/partners/udinus.png';
import mabesPolriLogo from '../../assets/partners/mabes-polri.png';
import kemenporaLogo from '../../assets/partners/kemenpora.png';
import megaDigitalLogo from '../../assets/partners/mega-digital.png';
import bpbdJatengLogo from '../../assets/partners/bpbd-jateng.png';
import poldaJatengLogo from '../../assets/partners/polda-jateng.png';
import smkNuSlawiLogo from '../../assets/partners/smk-nu-slawi.png';
import bangkitAcademyLogo from '../../assets/partners/bangkit-academy.png';
import disperindagSemarangLogo from '../../assets/partners/disperindag-semarang.png';

function Partners() {
  // Partners data with logo paths
  const partners = [
    {
      id: 1,
      name: 'Udinus',
      alt: 'Universitas Dian Nuswantoro Logo',
      logo: udinusLogo
    },
    {
      id: 2,
      name: 'Mabes Polri',
      alt: 'Mabes Polri Logo',
      logo: mabesPolriLogo
    },
    {
      id: 3,
      name: 'Kemenpora',
      alt: 'Kementerian Pemuda dan Olahraga Logo',
      logo: kemenporaLogo
    },
    {
      id: 4,
      name: 'Mega Digital',
      alt: 'Mega Digital Logo',
      logo: megaDigitalLogo
    },
    {
      id: 5,
      name: 'BPBD Jawa Tengah',
      alt: 'BPBD Jawa Tengah Logo',
      logo: bpbdJatengLogo
    },
    {
      id: 6,
      name: 'Polda Jateng',
      alt: 'Polda Jawa Tengah Logo',
      logo: poldaJatengLogo
    },
    {
      id: 7,
      name: 'SMK NU 1 Slawi',
      alt: 'SMK NU 1 Slawi Logo',
      logo: smkNuSlawiLogo
    },
    {
      id: 8,
      name: 'Bangkit Academy',
      alt: 'Bangkit Academy Logo',
      logo: bangkitAcademyLogo
    },
    {
      id: 9,
      name: 'Disperindag Semarang Kota',
      alt: 'Disperindag Semarang Kota Logo',
      logo: disperindagSemarangLogo
    }
  ];

  return (
    <section id="partners" className="partners-section">
      <div className="container">
        <div className="section-header">
          <h2>Mitra Kerjasama</h2>
          <p>Kami telah dipercaya oleh berbagai lembaga dan perusahaan terkemuka</p>
        </div>
        
        <div className="partners-grid">
          {partners.map(partner => (
            <div className="partner-item" key={partner.id}>
              <img 
                src={partner.logo} 
                alt={partner.alt} 
                className="partner-logo" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Partners;