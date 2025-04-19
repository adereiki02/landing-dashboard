import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import '../../styles/PortfolioList.css';

function ListPortfolio() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [projectTypeFilter, setProjectTypeFilter] = useState('all');
  const [projectStatusFilter, setProjectStatusFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [projectTypes, setProjectTypes] = useState([]);
  const [showSearchInput, setShowSearchInput] = useState(false);

  useEffect(() => {
    // Fetch project types
    fetchProjectTypes();
    // Fetch portfolio data
    fetchPortfolios();
  }, []);

  useEffect(() => {
    // Fetch portfolio data when these dependencies change
    fetchPortfolios();
  }, [currentPage, projectTypeFilter, projectStatusFilter, featuredFilter, searchTerm]);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      let url = `/api/portfolio/public?page=${currentPage}&limit=9`;
      
      if (projectTypeFilter !== 'all') {
        url += `&projectType=${projectTypeFilter}`;
      }
      
      if (projectStatusFilter !== 'all') {
        url += `&projectStatus=${projectStatusFilter}`;
      }
      
      if (featuredFilter !== 'all') {
        url += `&featured=${featuredFilter === 'featured' ? 'true' : 'false'}`;
      }
      
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      
      // Only fetch published portfolios
      url += '&status=published';
      
      const response = await axios.get(url);
      setPortfolios(response.data.portfolioItems);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      setLoading(false);
    }
  };

  const fetchProjectTypes = async () => {
    try {
      const response = await axios.get('/api/portfolio/project-types');
      setProjectTypes(response.data);
    } catch (error) {
      console.error('Error fetching project types:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleProjectTypeFilterChange = (e) => {
    setProjectTypeFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleFeaturedFilterChange = (e) => {
    setFeaturedFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleProjectStatusFilterChange = (e) => {
    setProjectStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPortfolios();
  };

  const clearFilters = () => {
    setProjectTypeFilter('all');
    setProjectStatusFilter('all');
    setFeaturedFilter('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
  };

  const closeSearchInput = () => {
    setShowSearchInput(false);
    setSearchTerm('');
  };

  if (loading && portfolios.length === 0) {
    return (
      <div className="portfolio-list-container">
        <div className="page-header">
          <h1>Our Portfolio</h1>
          <p>Explore our latest projects and success stories</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-list-container">
      <div className="page-header">
        <h1>Our Portfolio</h1>
        <p>Explore our latest projects and success stories</p>
      </div>

      <div className="portfolio-filters-container">
        {!showSearchInput ? (
          <div className="filters-row">
            <div className="search-button-container">
              <button 
                className="search-toggle-button" 
                onClick={toggleSearchInput}
              >
                <FaSearch /> Search
              </button>
            </div>
            
            <div className="filter-dropdowns">
              <div className="filter-group">
                <select
                  id="projectTypeFilter"
                  value={projectTypeFilter}
                  onChange={handleProjectTypeFilterChange}
                  className="filter-select"
                >
                  <option value="all">All Categories</option>
                  {projectTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <select
                  id="featuredFilter"
                  value={featuredFilter}
                  onChange={handleFeaturedFilterChange}
                  className="filter-select"
                >
                  <option value="all">All Projects</option>
                  <option value="featured">Featured Only</option>
                  <option value="not-featured">Not Featured</option>
                </select>
              </div>

              <div className="filter-group">
                <select
                  id="projectStatusFilter"
                  value={projectStatusFilter}
                  onChange={handleProjectStatusFilterChange}
                  className="filter-select"
                >
                  <option value="all">All Statuses</option>
                  <option value="progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              {(projectTypeFilter !== 'all' || projectStatusFilter !== 'all' || featuredFilter !== 'all') && (
                <button className="clear-filters-button" onClick={clearFilters}>
                  <FaTimes /> Clear
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="search-expanded-row">
            <form onSubmit={handleSearchSubmit} className="search-form-expanded">
              <div className="search-input-container-expanded">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input-expanded"
                  autoFocus
                />
                <button type="submit" className="search-button-expanded">
                  <FaSearch />
                </button>
              </div>
            </form>
            <button className="close-search-button" onClick={closeSearchInput}>
              <FaTimes />
            </button>
          </div>
        )}
      </div>

      {portfolios.length > 0 ? (
        <div className="portfolio-grid">
          {portfolios.map(item => (
            <div key={item._id} className="portfolio-card">
              <Link to={`/portfolio/${item.slug}`} className="portfolio-link">
                <div className="portfolio-image">
                  <img src={item.featuredImage} alt={item.title} />
                  <div className="portfolio-badges">
                    {item.featured && (
                      <span className="status-badge featured">Featured</span>
                    )}
                    {item.projectStatus === 'progress' && (
                      <span className="status-badge progress">In Progress</span>
                    )}
                    {item.projectStatus === 'completed' && (
                      <span className="status-badge completed">Completed</span>
                    )}
                  </div>
                </div>
                <div className="portfolio-details">
                  <h3>{item.title}</h3>
                  <p className="portfolio-category">{item.projectType}</p>
                  <p className="portfolio-client">Client: {item.client}</p>
                  <div className="portfolio-tech-tags">
                    {item.technologies && item.technologies.slice(0, 3).map((tech, index) => (
                      <span key={index} className="tech-tag">{tech}</span>
                    ))}
                    {item.technologies && item.technologies.length > 3 && (
                      <span className="tech-tag more">+{item.technologies.length - 3} more</span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <h3>No projects found</h3>
          <p>Try adjusting your search criteria or filters</p>
          <button className="clear-filters-button" onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &laquo; Previous
          </button>
          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => {
              // Show first page, last page, current page, and pages around current page
              const pageNum = i + 1;
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                (pageNum === currentPage - 2 && currentPage > 3) ||
                (pageNum === currentPage + 2 && currentPage < totalPages - 2)
              ) {
                return <span key={pageNum} className="pagination-ellipsis">...</span>;
              }
              return null;
            }).filter(Boolean)}
          </div>
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next &raquo;
          </button>
        </div>
      )}
    </div>
  );
}

export default ListPortfolio;