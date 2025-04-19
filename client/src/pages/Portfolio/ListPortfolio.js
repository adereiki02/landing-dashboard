import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaFilter, FaTimes, FaArrowRight, FaCode, FaLaptopCode, FaRegClock } from 'react-icons/fa';
import '../../styles/PortfolioList.css';
import BackToTop from '../../components/common/BackToTop';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';



function ListPortfolio() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    fetchPortfolioItems();
  }, []);

  useEffect(() => {
    // Fetch portfolio data when these dependencies change
    fetchPortfolioItems();
  }, [currentPage, projectTypeFilter, projectStatusFilter, featuredFilter, searchTerm]);

  const fetchPortfolioItems = async () => {
    try {
      setLoading(true);
      let url = `/api/portfolio?page=${currentPage}&limit=9`;
      
      if (projectTypeFilter !== 'all') {
        url += `&projectType=${projectTypeFilter}`;
      }
      
      if (projectStatusFilter !== 'all') {
        url += `&projectStatus=${projectStatusFilter}`;
      }
      
      if (featuredFilter !== 'all') {
        url += `&isFeatured=${featuredFilter === 'featured' ? 'true' : 'false'}`;
      }
      
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      
      // Only fetch published portfolioItems
      url += '&status=published';
      
      const response = await axios.get(url);
      
      // Log the first item to check its structure
      if (response.data.portfolioItems && response.data.portfolioItems.length > 0) {
        console.log('First portfolio item:', response.data.portfolioItems[0]);
        console.log('isFeatured value:', response.data.portfolioItems[0].isFeatured);
        console.log('isFeatured type:', typeof response.data.portfolioItems[0].isFeatured);
      }
      
      // Process the data - force some items to be featured for testing
      const processedItems = response.data.portfolioItems.map((item, index) => ({
        ...item,
        // Make every other item featured for testing
        isFeatured: index % 2 === 0 ? true : item.isFeatured
      }));
      
      console.log('Processed items:', processedItems);
      
      setPortfolioItems(processedItems);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching portfolioItems:', error);
      setError('Failed to load portfolio items. Please try again later.');
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
    fetchPortfolioItems();
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

  if (loading && portfolioItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="portfolio-list-container">
          <div className="page-header">
            <div className="header-content">
              <h1>Our <span className="highlight">Portfolio</span></h1>
              <p>Explore our latest projects and success stories that showcase our expertise and innovation</p>
            </div>
            <div className="header-decoration">
              <div className="decoration-circle"></div>
              <div className="decoration-line"></div>
            </div>
          </div>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading amazing projects...</p>
          </div>
        </div>
        <Footer />
        <BackToTop />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="portfolio-list-container">
        <div className="page-header">
          <div className="header-content">
            <h1>Our <span className="highlight">Portfolio</span></h1>
            <p>Explore our latest projects and success stories that showcase our expertise and innovation</p>
          </div>
          <div className="header-decoration">
            <div className="decoration-circle"></div>
            <div className="decoration-line"></div>
          </div>
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

        {portfolioItems.length > 0 ? (
          <div className="portfolio-grid">
            {portfolioItems.map(item => (
              <div key={item._id} className="portfolio-card">
                <Link to={`/portfolio/${item.slug}`} className="portfolio-link">
                  <div className="portfolio-image">
                    <img src={item.featuredImage} alt={item.title} />
                    {item.projectStatus === 'completed' && (
                      <div className="status-badge completed">Completed</div>
                    )}
                    {item.projectStatus === 'progress' && (
                      <div className="status-badge progress">In Progress</div>
                    )}
                    {item.isFeatured && (
                      <div className="featured-badge">Featured</div>
                    )}
                  </div>
                  <div className="portfolio-details">
                    <h3>{item.title}</h3>
                    <div className="portfolio-meta">
                      <div className="meta-item">
                        <span><strong>Category:</strong> {item.projectType}</span>
                      </div>
                      <div className="meta-item">
                        <span><strong>Client:</strong> {item.client}</span>
                      </div>
                      <div className="meta-item">
                        <span><strong>Date:</strong> {new Date(item.completionDate || item.createdAt).toLocaleDateString()}</span>
                      </div>
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
              className="pagination-btn prev"
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
              className="pagination-btn next"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next &raquo;
            </button>
          </div>
        )}
      </div>
      <Footer />
      <BackToTop />
    </>
  );
}

export default ListPortfolio;