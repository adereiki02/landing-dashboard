import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaArrowUp, FaArrowDown, FaLink } from 'react-icons/fa';
import '../../styles/Dashboard.css';

function PartnersManagement() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
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
        // Fetch partners data
        fetchPartners();
      }
    } else {
      navigate('/login');
    }
  }, [navigate, currentPage, statusFilter]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      let url = `/api/partners?page=${currentPage}`;
      
      if (statusFilter !== 'all') {
        url += `&isActive=${statusFilter === 'active'}`;
      }
      
      const response = await axios.get(url);
      setPartners(response.data.partners);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching partners:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        await axios.delete(`/api/partners/${id}`);
        // Refresh partners list
        fetchPartners();
      } catch (error) {
        console.error('Error deleting partner:', error);
        alert('Failed to delete partner');
      }
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await axios.put(`/api/partners/${id}`, { isActive: !currentStatus });
      // Refresh partners list
      fetchPartners();
    } catch (error) {
      console.error('Error updating partner status:', error);
      alert('Failed to update partner status');
    }
  };

  const moveUp = async (id) => {
    try {
      await axios.put(`/api/partners/order`, { id, direction: 'up' });
      // Refresh partners list
      fetchPartners();
    } catch (error) {
      console.error('Error moving partner up:', error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        alert('Failed to update partner order');
      }
    }
  };

  const moveDown = async (id) => {
    try {
      await axios.put(`/api/partners/order`, { id, direction: 'down' });
      // Refresh partners list
      fetchPartners();
    } catch (error) {
      console.error('Error moving partner down:', error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        alert('Failed to update partner order');
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const filteredPartners = partners.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2>Partners Management</h2>
          <Link to="/dashboard/partners/create" className="btn-primary">
            <FaPlus /> Add New Partner
          </Link>
        </div>
        
        <div className="search-filter">
          <div className="search-box">
            <FaSearch />
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Logo</th>
                <th>Name</th>
                <th>Website</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartners.length > 0 ? (
                filteredPartners.map((item, index) => (
                  <tr key={item._id}>
                    <td className="order-column">
                      <div className="order-buttons">
                        <button 
                          onClick={() => moveUp(item._id)} 
                          disabled={index === 0}
                          className="order-btn"
                        >
                          <FaArrowUp />
                        </button>
                        <span>{item.order}</span>
                        <button 
                          onClick={() => moveDown(item._id)} 
                          disabled={index === partners.length - 1}
                          className="order-btn"
                        >
                          <FaArrowDown />
                        </button>
                      </div>
                    </td>
                    <td>
                      <img 
                        src={item.logo} 
                        alt={item.name} 
                        className="partner-logo"
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>
                      {item.websiteUrl && (
                        <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer" className="website-link">
                          <FaLink /> {item.websiteUrl}
                        </a>
                      )}
                    </td>
                    <td>
                      <button 
                        onClick={() => toggleActive(item._id, item.isActive)} 
                        className={`status-toggle ${item.isActive ? 'active' : 'inactive'}`}
                      >
                        {item.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="actions">
                      <Link to={`/dashboard/partners/edit/${item._id}`} className="btn-edit">
                        <FaEdit /> Edit
                      </Link>
                      <button onClick={() => handleDelete(item._id)} className="btn-delete">
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">No partners found</td>
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
    </div>
  );
}

export default PartnersManagement;