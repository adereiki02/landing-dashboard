import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaArrowUp, FaArrowDown, FaLink, FaFilter, FaToggleOn, FaToggleOff, FaSort } from 'react-icons/fa';
import '../../styles/Dashboard.css';
import '../../styles/DashboardComponents.css';

function PartnersManagement() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('order');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [bulkActionSelected, setBulkActionSelected] = useState([]);
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
  }, [navigate, currentPage, statusFilter, sortOrder]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      let url = `/api/partners?page=${currentPage}`;
      
      if (statusFilter !== 'all') {
        url += `&isActive=${statusFilter === 'active'}`;
      }
      
      if (sortOrder) {
        url += `&sort=${sortOrder}`;
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
        // If the deleted partner was selected, clear the selection
        if (selectedPartner && selectedPartner._id === id) {
          setSelectedPartner(null);
        }
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

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setSortOrder('order');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleViewDetails = (partner) => {
    setSelectedPartner(partner);
  };

  const closeModal = () => {
    setSelectedPartner(null);
  };

  const toggleBulkSelection = (id) => {
    if (bulkActionSelected.includes(id)) {
      setBulkActionSelected(bulkActionSelected.filter(item => item !== id));
    } else {
      setBulkActionSelected([...bulkActionSelected, id]);
    }
  };

  const toggleAllSelection = () => {
    if (bulkActionSelected.length === filteredPartners.length) {
      setBulkActionSelected([]);
    } else {
      setBulkActionSelected(filteredPartners.map(partner => partner._id));
    }
  };

  const bulkActivate = async () => {
    if (bulkActionSelected.length === 0) return;
    
    try {
      await axios.put('/api/partners/bulk-update', {
        ids: bulkActionSelected,
        update: { isActive: true }
      });
      fetchPartners();
      setBulkActionSelected([]);
    } catch (error) {
      console.error('Error in bulk activation:', error);
      alert('Failed to update partners');
    }
  };

  const bulkDeactivate = async () => {
    if (bulkActionSelected.length === 0) return;
    
    try {
      await axios.put('/api/partners/bulk-update', {
        ids: bulkActionSelected,
        update: { isActive: false }
      });
      fetchPartners();
      setBulkActionSelected([]);
    } catch (error) {
      console.error('Error in bulk deactivation:', error);
      alert('Failed to update partners');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo(0, 0);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const filteredPartners = partners.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <DashboardHeader />
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading partners...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <DashboardHeader />
        
        <div className="content-header">
          <div className="title-section">
            <h2>Partners Management</h2>
            <p>{filteredPartners.length} partners found</p>
          </div>
          <Link to="/dashboard/partners/create" className="btn-primary">
            <FaPlus /> Add New Partner
          </Link>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-actions">
              <button className="btn-filter" onClick={toggleFilters}>
                <FaFilter /> Filters
              </button>
              <select 
                className="sort-select"
                value={sortOrder}
                onChange={handleSortOrderChange}
              >
                <option value="order">Custom Order</option>
                <option value="nameAsc">Name (A-Z)</option>
                <option value="nameDesc">Name (Z-A)</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
          
          {showFilters && (
            <div className="expanded-filters">
              <div className="filter-group">
                <label>Status:</label>
                <select 
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <button className="btn-clear-filters" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
          
          {bulkActionSelected.length > 0 && (
            <div className="bulk-actions">
              <span>{bulkActionSelected.length} partners selected</span>
              <div className="bulk-buttons">
                <button className="btn-success" onClick={bulkActivate}>
                  <FaToggleOn /> Activate All
                </button>
                <button className="btn-warning" onClick={bulkDeactivate}>
                  <FaToggleOff /> Deactivate All
                </button>
                <button className="btn-secondary" onClick={() => setBulkActionSelected([])}>
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          {filteredPartners.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">ud83dudc65</div>
              <h3>No partners found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table partners-table">
                <thead>
                  <tr>
                    <th>
                      <input 
                        type="checkbox" 
                        checked={bulkActionSelected.length === filteredPartners.length && filteredPartners.length > 0}
                        onChange={toggleAllSelection}
                      />
                    </th>
                    <th>Order</th>
                    <th>Logo</th>
                    <th>Name</th>
                    <th>Website</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPartners.map((item, index) => (
                    <tr key={item._id} className={bulkActionSelected.includes(item._id) ? 'selected-row' : ''}>
                      <td>
                        <input 
                          type="checkbox" 
                          checked={bulkActionSelected.includes(item._id)}
                          onChange={() => toggleBulkSelection(item._id)}
                        />
                      </td>
                      <td className="order-column">
                        <div className="order-buttons">
                          <button 
                            onClick={() => moveUp(item._id)} 
                            disabled={index === 0}
                            className="order-btn"
                            title="Move up"
                          >
                            <FaArrowUp />
                          </button>
                          <span>{item.order}</span>
                          <button 
                            onClick={() => moveDown(item._id)} 
                            disabled={index === partners.length - 1}
                            className="order-btn"
                            title="Move down"
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
                          onClick={() => handleViewDetails(item)}
                        />
                      </td>
                      <td>
                        <span className="partner-name">{item.name}</span>
                      </td>
                      <td>
                        {item.website ? (
                          <a href={item.website} target="_blank" rel="noopener noreferrer" className="website-link">
                            <FaLink /> {new URL(item.website).hostname}
                          </a>
                        ) : (
                          <span className="text-muted">No website</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${item.isActive ? 'active' : 'inactive'}`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => toggleActive(item._id, item.isActive)} 
                            className={`btn-toggle ${item.isActive ? 'active' : 'inactive'}`}
                            title={item.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {item.isActive ? <FaToggleOn /> : <FaToggleOff />}
                          </button>
                          <Link to={`/dashboard/partners/edit/${item._id}`} className="btn-edit" title="Edit partner">
                            <FaEdit />
                          </Link>
                          <button onClick={() => handleDelete(item._id)} className="btn-delete" title="Delete partner">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              
              <div className="pagination-numbers">
                {[...Array(totalPages).keys()].map(number => (
                  <button
                    key={number + 1}
                    onClick={() => handlePageChange(number + 1)}
                    className={`pagination-number ${currentPage === number + 1 ? 'active' : ''}`}
                  >
                    {number + 1}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      
      {selectedPartner && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>u00d7</button>
            <h2>{selectedPartner.name}</h2>
            <div className="modal-body">
              <img src={selectedPartner.logo} alt={selectedPartner.name} className="modal-image" />
              <div className="modal-details">
                <p><strong>Status:</strong> 
                  <span className={`status-badge ${selectedPartner.isActive ? 'active' : 'inactive'}`}>
                    {selectedPartner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </p>
                {selectedPartner.website && (
                  <p>
                    <strong>Website:</strong> 
                    <a href={selectedPartner.website} target="_blank" rel="noopener noreferrer">
                      {selectedPartner.website}
                    </a>
                  </p>
                )}
                <p><strong>Order:</strong> {selectedPartner.order}</p>
                {selectedPartner.description && (
                  <p><strong>Description:</strong> {selectedPartner.description}</p>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <Link to={`/dashboard/partners/edit/${selectedPartner._id}`} className="btn-primary">
                <FaEdit /> Edit Partner
              </Link>
              <button 
                onClick={() => toggleActive(selectedPartner._id, selectedPartner.isActive)}
                className={`btn-toggle-large ${selectedPartner.isActive ? 'active' : 'inactive'}`}
              >
                {selectedPartner.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PartnersManagement;