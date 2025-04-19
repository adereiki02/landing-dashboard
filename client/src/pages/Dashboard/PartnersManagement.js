import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaArrowUp, FaArrowDown, FaLink, FaFilter, 
  FaToggleOn, FaToggleOff, FaSort, FaEye, FaInfoCircle, FaExternalLinkAlt } from 'react-icons/fa';
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
      console.log('Toggling active status:', id, 'Current status:', currentStatus, 'New status:', !currentStatus);
      const response = await axios.put(`/api/partners/${id}`, { isActive: !currentStatus });
      console.log('Toggle response:', response.data);
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
            <p>
              <FaInfoCircle className="info-icon" /> 
              {filteredPartners.length} partner{filteredPartners.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <Link to="/dashboard/partners/create" className="btn-primary btn-with-icon">
            <FaPlus className="btn-icon" /> 
            <span>Add New Partner</span>
          </Link>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search partners by name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search partners"
              />
              {searchTerm && (
                <button 
                  className="clear-search" 
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  &times;
                </button>
              )}
            </div>
            
            <div className="filter-actions">
              <button className="btn-filter" onClick={toggleFilters} aria-expanded={showFilters}>
                <FaFilter className="filter-icon" /> 
                <span>Filters</span>
                {(statusFilter !== 'all' || sortOrder !== 'order') && (
                  <span className="filter-badge">!</span>
                )}
              </button>
              <div className="sort-container">
                <select 
                  className="sort-select"
                  value={sortOrder}
                  onChange={handleSortOrderChange}
                  aria-label="Sort partners"
                >
                  <option value="order">Custom Order</option>
                  <option value="nameAsc">Name (A-Z)</option>
                  <option value="nameDesc">Name (Z-A)</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <FaSort className="sort-icon" />
              </div>
            </div>
          </div>
          
          {showFilters && (
            <div className="expanded-filters">
              <div className="filter-group">
                <label htmlFor="status-filter">Status:</label>
                <div className="select-wrapper">
                  <select 
                    id="status-filter"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </div>
              </div>
              
              <button 
                className="btn-clear-filters" 
                onClick={clearFilters}
                disabled={statusFilter === 'all' && sortOrder === 'order' && !searchTerm}
              >
                Reset All Filters
              </button>
            </div>
          )}
          
          {bulkActionSelected.length > 0 && (
            <div className="bulk-actions">
              <div className="bulk-info">
                <span className="bulk-count">{bulkActionSelected.length}</span>
                <span className="bulk-text">partner{bulkActionSelected.length !== 1 ? 's' : ''} selected</span>
              </div>
              <div className="bulk-buttons">
                <button className="btn-success" onClick={bulkActivate}>
                  <FaToggleOn className="btn-icon" /> Activate All
                </button>
                <button className="btn-warning" onClick={bulkDeactivate}>
                  <FaToggleOff className="btn-icon" /> Deactivate All
                </button>
                <button className="btn-secondary" onClick={() => setBulkActionSelected([])}>
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          {filteredPartners.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🤝</div>
              <h3>No partners found</h3>
              <p>Try adjusting your search or filter criteria</p>
              {(searchTerm || statusFilter !== 'all') && (
                <button className="btn-secondary" onClick={clearFilters}>
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table partners-table">
                <thead>
                  <tr>
                    <th className="checkbox-column">
                      <div className="custom-checkbox">
                        <input 
                          type="checkbox" 
                          id="select-all"
                          checked={bulkActionSelected.length === filteredPartners.length && filteredPartners.length > 0}
                          onChange={toggleAllSelection}
                        />
                        <label htmlFor="select-all" className="checkbox-label"></label>
                      </div>
                    </th>
                    <th className="order-column">Order</th>
                    <th>Logo</th>
                    <th>Name</th>
                    <th>Website</th>
                    <th>Status</th>
                    <th className="actions-column">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPartners.map((item, index) => (
                    <tr key={item._id} className={bulkActionSelected.includes(item._id) ? 'selected-row' : ''}>
                      <td>
                        <div className="custom-checkbox">
                          <input 
                            type="checkbox" 
                            id={`select-${item._id}`}
                            checked={bulkActionSelected.includes(item._id)}
                            onChange={() => toggleBulkSelection(item._id)}
                          />
                          <label htmlFor={`select-${item._id}`} className="checkbox-label"></label>
                        </div>
                      </td>
                      <td className="order-column">
                        <div className="order-buttons">
                          <button 
                            onClick={() => moveUp(item._id)} 
                            disabled={index === 0}
                            className="order-btn"
                            title="Move up"
                            aria-label="Move partner up"
                          >
                            <FaArrowUp />
                          </button>
                          <span className="order-number">{item.order}</span>
                          <button 
                            onClick={() => moveDown(item._id)} 
                            disabled={index === partners.length - 1}
                            className="order-btn"
                            title="Move down"
                            aria-label="Move partner down"
                          >
                            <FaArrowDown />
                          </button>
                        </div>
                      </td>
                      <td className="logo-column">
                        <div className="logo-wrapper">
                          <img 
                            src={item.logo} 
                            alt={`${item.name} logo`} 
                            className="partner-logo"
                            onClick={() => handleViewDetails(item)}
                          />
                        </div>
                      </td>
                      <td>
                        <span className="partner-name" onClick={() => handleViewDetails(item)}>{item.name}</span>
                        {item.description && (
                          <p className="partner-description">{item.description.substring(0, 60)}{item.description.length > 60 ? '...' : ''}</p>
                        )}
                      </td>
                      <td>
                        {item.website ? (
                          <a href={item.website} target="_blank" rel="noopener noreferrer" className="website-link">
                            <FaExternalLinkAlt className="link-icon" /> 
                            <span>{new URL(item.website).hostname}</span>
                          </a>
                        ) : (
                          <span className="text-muted">No website</span>
                        )}
                      </td>
                      <td>
                        <span className={`partner-status-badge ${item.isActive ? 'active' : 'inactive-badge'}`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => toggleActive(item._id, item.isActive)} 
                            className={`btn-toggle ${item.isActive ? 'active' : 'inactive'}`}
                            title={item.isActive ? 'Deactivate' : 'Activate'}
                            aria-label={item.isActive ? 'Deactivate partner' : 'Activate partner'}
                            style={{marginRight: '8px'}}
                          >
                            <span className="switch-track"></span>
                            <span className="switch-icon">{item.isActive ? <FaToggleOn size={16} /> : <FaToggleOff size={16} />}</span>
                          </button>
                          <button 
                            onClick={() => handleViewDetails(item)}
                            className="btn-view"
                            title="View details"
                            aria-label="View partner details"
                          >
                            <FaEye size={18} />
                          </button>
                          <Link to={`/dashboard/partners/edit/${item._id}`} className="btn-edit" title="Edit partner" aria-label="Edit partner">
                            <FaEdit size={18} />
                          </Link>
                          <button onClick={() => handleDelete(item._id)} className="btn-delete" title="Delete partner" aria-label="Delete partner">
                            <FaTrash size={18} />
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
                className="pagination-button prev-button"
                aria-label="Previous page"
              >
                <span aria-hidden="true">&laquo;</span> Previous
              </button>
              
              <div className="pagination-numbers">
                {[...Array(totalPages).keys()].map(number => {
                  const pageNumber = number + 1;
                  // Show first page, last page, current page, and pages around current page
                  if (
                    pageNumber === 1 || 
                    pageNumber === totalPages || 
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
                        aria-label={`Page ${pageNumber}`}
                        aria-current={currentPage === pageNumber ? 'page' : undefined}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    (pageNumber === 2 && currentPage > 3) ||
                    (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    // Show ellipsis for skipped pages
                    return <span key={pageNumber} className="pagination-ellipsis">...</span>;
                  }
                  return null;
                })}
              </div>
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="pagination-button next-button"
                aria-label="Next page"
              >
                Next <span aria-hidden="true">&raquo;</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {selectedPartner && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content partner-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} aria-label="Close modal">&times;</button>
            <div className="modal-header">
              <h2>{selectedPartner.name}</h2>
              <span className={`partner-status-badge ${selectedPartner.isActive ? 'active' : 'inactive-badge'}`}>
                {selectedPartner.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="modal-body">
              <div className="modal-image-container">
                <img src={selectedPartner.logo} alt={`${selectedPartner.name} logo`} className="modal-image" />
              </div>
              <div className="modal-details">
                <div className="detail-group">
                  <h4>Partner Information</h4>
                  <div className="detail-item">
                    <span className="detail-label">Display Order:</span>
                    <span className="detail-value">{selectedPartner.order}</span>
                  </div>
                  
                  {selectedPartner.website && (
                    <div className="detail-item">
                      <span className="detail-label">Website:</span>
                      <a href={selectedPartner.website} target="_blank" rel="noopener noreferrer" className="detail-link">
                        {selectedPartner.website} <FaExternalLinkAlt className="external-link-icon" />
                      </a>
                    </div>
                  )}
                  
                  {selectedPartner.description && (
                    <div className="detail-item description-item">
                      <span className="detail-label">Description:</span>
                      <p className="detail-value description-value">{selectedPartner.description}</p>
                    </div>
                  )}
                </div>
                
                <div className="detail-group">
                  <h4>System Information</h4>
                  <div className="detail-item">
                    <span className="detail-label">Created:</span>
                    <span className="detail-value">
                      {selectedPartner.createdAt ? new Date(selectedPartner.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      }) : 'N/A'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Last Updated:</span>
                    <span className="detail-value">
                      {selectedPartner.updatedAt ? new Date(selectedPartner.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      }) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <Link to={`/dashboard/partners/edit/${selectedPartner._id}`} className="btn-primary">
                <FaEdit size={18} className="btn-icon" /> Edit Partner
              </Link>
              <button 
                onClick={() => toggleActive(selectedPartner._id, selectedPartner.isActive)}
                className={`btn-toggle-large ${selectedPartner.isActive ? 'active' : 'inactive'}`}
              >
                {selectedPartner.isActive ? <><FaToggleOff size={20} className="btn-icon" /> Deactivate</> : <><FaToggleOn size={20} className="btn-icon" /> Activate</>}
              </button>
              <button className="btn-secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PartnersManagement;