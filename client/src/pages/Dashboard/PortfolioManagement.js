import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye } from 'react-icons/fa';
import '../../styles/Dashboard.css';

function PortfolioManagement() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Sample portfolio data
  const samplePortfolios = [
    { id: 1, title: 'E-Commerce Platform', category: 'Web Development', client: 'ABC Corp', date: '2023-05-10', featured: true },
    { id: 2, title: 'Mobile Banking App', category: 'Mobile App', client: 'XYZ Bank', date: '2023-06-22', featured: true },
    { id: 3, title: 'Corporate Website Redesign', category: 'Web Design', client: 'Global Industries', date: '2023-07-15', featured: false },
    { id: 4, title: 'Inventory Management System', category: 'Software', client: 'Retail Solutions', date: '2023-08-05', featured: false },
    { id: 5, title: 'Healthcare Patient Portal', category: 'Web Application', client: 'City Hospital', date: '2023-09-18', featured: true },
  ];

  useEffect(() => {
    // Get user info from localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      
      // Check if user is admin or superadmin
      if (!parsedUser.role || (parsedUser.role !== 'admin' && parsedUser.role !== 'superadmin')) {
        navigate('/');
      }
    } else {
      navigate('/login');
    }
    
    // Simulate API call to fetch portfolios
    setTimeout(() => {
      setPortfolios(samplePortfolios);
      setLoading(false);
    }, 1000);
  }, [navigate]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this portfolio item?')) {
      // Filter out the deleted portfolio
      setPortfolios(portfolios.filter(item => item.id !== id));
    }
  };

  const toggleFeatured = (id) => {
    setPortfolios(portfolios.map(item => 
      item.id === id ? { ...item, featured: !item.featured } : item
    ));
  };

  const filteredPortfolios = portfolios.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <DashboardHeader />
        
        <div className="content-header">
          <h2>Portfolio Management</h2>
          <Link to="/dashboard/portfolio/create" className="btn-primary">
            <FaPlus /> Add New Project
          </Link>
        </div>
        
        <div className="search-filter">
          <div className="search-box">
            <FaSearch />
            <input 
              type="text" 
              placeholder="Search by title, category or client..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="filter-select">
            <option value="all">All Categories</option>
            <option value="web-development">Web Development</option>
            <option value="mobile-app">Mobile App</option>
            <option value="web-design">Web Design</option>
            <option value="software">Software</option>
          </select>
          <select className="filter-select">
            <option value="all">All Status</option>
            <option value="featured">Featured</option>
            <option value="not-featured">Not Featured</option>
          </select>
        </div>
        
        <div className="portfolio-grid">
          {filteredPortfolios.length > 0 ? (
            filteredPortfolios.map(item => (
              <div key={item.id} className="portfolio-card">
                <div className="portfolio-image">
                  <img src={`/images/portfolio-${item.id}.jpg`} alt={item.title} />
                  {item.featured && <span className="featured-badge">Featured</span>}
                </div>
                <div className="portfolio-details">
                  <h3>{item.title}</h3>
                  <p><strong>Category:</strong> {item.category}</p>
                  <p><strong>Client:</strong> {item.client}</p>
                  <p><strong>Date:</strong> {item.date}</p>
                </div>
                <div className="portfolio-actions">
                  <button 
                    onClick={() => toggleFeatured(item.id)} 
                    className={`btn-feature ${item.featured ? 'featured' : ''}`}
                  >
                    {item.featured ? 'Remove Featured' : 'Set as Featured'}
                  </button>
                  <div className="action-buttons">
                    <Link to={`/dashboard/portfolio/edit/${item.id}`} className="btn-edit">
                      <FaEdit /> Edit
                    </Link>
                    <button onClick={() => handleDelete(item.id)} className="btn-delete">
                      <FaTrash /> Delete
                    </button>
                    <Link to={`/portfolio/${item.id}`} className="btn-view" target="_blank">
                      <FaEye /> View
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">No portfolio items found</div>
          )}
        </div>
        
        <div className="pagination">
          <button className="pagination-btn">Previous</button>
          <div className="pagination-numbers">
            <button className="pagination-number active">1</button>
            <button className="pagination-number">2</button>
            <button className="pagination-number">3</button>
          </div>
          <button className="pagination-btn">Next</button>
        </div>
      </div>
    </div>
  );
}

export default PortfolioManagement;