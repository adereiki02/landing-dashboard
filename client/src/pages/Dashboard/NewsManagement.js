import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye } from 'react-icons/fa';
import '../../styles/Dashboard.css';
import '../../styles/Modal.css';

function NewsManagement() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      
      // Check if user is admin or superadmin
      if (!parsedUser.role || (parsedUser.role !== 'admin' && parsedUser.role !== 'superadmin')) {
        navigate('/');
      } else {
        // Fetch news data
        fetchNews();
        // Fetch categories
        fetchCategories();
      }
    } else {
      navigate('/login');
    }
  }, [navigate, currentPage, categoryFilter, statusFilter]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      let url = `/api/news?page=${currentPage}`;
      
      if (categoryFilter !== 'all') {
        url += `&category=${categoryFilter}`;
      }
      
      if (statusFilter !== 'all') {
        url += `&status=${statusFilter}`;
      }
      
      const response = await axios.get(url);
      setNews(response.data.news);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/news/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const openDeleteModal = (news) => {
    setNewsToDelete(news);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!newsToDelete) return;
    
    try {
      await axios.delete(`/api/news/${newsToDelete._id}`);
      // Close modal
      setShowDeleteModal(false);
      setNewsToDelete(null);
      // Refresh news list
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('Failed to delete news article');
      setShowDeleteModal(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
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
          <select 
            className="filter-select" 
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
          >
            <option value="all">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
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
                  <tr key={item._id}>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`news-status-badge ${item.status.toLowerCase()}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td>{item.viewCount}</td>
                    <td className="actions">
                      <Link to={`/berita/${item.slug}`} className="btn-view" target="_blank">
                        <FaEye /> View
                      </Link>
                      <Link to={`/dashboard/news/edit/${item._id}`} className="btn-edit">
                        <FaEdit /> Edit
                      </Link>
                      <button onClick={() => openDeleteModal(item)} className="btn-delete">
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
          <button 
            className="pagination-btn" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="pagination-numbers">
            {[...Array(totalPages).keys()].map(number => (
              <button 
                key={number + 1}
                className={`pagination-number ${currentPage === number + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(number + 1)}
              >
                {number + 1}
              </button>
            ))}
          </div>
          <button 
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Konfirmasi Hapus Artikel"
        message={
          <>
            <p>Apakah Anda yakin ingin menghapus artikel <strong>"{newsToDelete?.title}"</strong>?</p>
            <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>Tindakan ini tidak dapat dibatalkan dan semua data terkait artikel ini akan dihapus secara permanen.</p>
          </>
        }
        confirmText="Hapus Artikel"
        cancelText="Batal"
        type="delete"
      />
    </div>
  );
}

export default NewsManagement;