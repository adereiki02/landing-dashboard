import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import '../../styles/Dashboard.css';

function NewsManagement() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Sample news data
  const sampleNews = [
    { id: 1, title: 'New Website Launch', category: 'Company', date: '2023-06-15', status: 'Published', views: 1250 },
    { id: 2, title: 'Tech Conference 2023', category: 'Events', date: '2023-07-22', status: 'Published', views: 980 },
    { id: 3, title: 'Partnership with Microsoft', category: 'Business', date: '2023-08-05', status: 'Published', views: 2100 },
    { id: 4, title: 'New Office Opening', category: 'Company', date: '2023-09-10', status: 'Draft', views: 0 },
    { id: 5, title: 'Developer Meetup', category: 'Events', date: '2023-10-18', status: 'Published', views: 750 },
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
    
    // Simulate API call to fetch news
    setTimeout(() => {
      setNews(sampleNews);
      setLoading(false);
    }, 1000);
  }, [navigate]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      // Filter out the deleted news
      setNews(news.filter(item => item.id !== id));
    }
  };

  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2>News Management</h2>
          <Link to="/dashboard/news/create" className="btn-primary">
            <FaPlus /> Add New Article
          </Link>
        </div>
        
        <div className="search-filter">
          <div className="search-box">
            <FaSearch />
            <input 
              type="text" 
              placeholder="Search by title or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="filter-select">
            <option value="all">All Categories</option>
            <option value="company">Company</option>
            <option value="events">Events</option>
            <option value="business">Business</option>
          </select>
          <select className="filter-select">
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.length > 0 ? (
                filteredNews.map(item => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>{item.date}</td>
                    <td>
                      <span className={`status-badge ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.views}</td>
                    <td className="actions">
                      <Link to={`/dashboard/news/edit/${item.id}`} className="btn-edit">
                        <FaEdit /> Edit
                      </Link>
                      <button onClick={() => handleDelete(item.id)} className="btn-delete">
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">No news articles found</td>
                </tr>
              )}
            </tbody>
          </table>
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

export default NewsManagement;