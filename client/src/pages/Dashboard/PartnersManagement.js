import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaArrowUp, FaArrowDown, FaLink } from 'react-icons/fa';
import '../../styles/Dashboard.css';

function PartnersManagement() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Sample partners data
  const samplePartners = [
    { id: 1, name: 'Microsoft', category: 'Technology', website: 'https://microsoft.com', order: 1, active: true },
    { id: 2, name: 'Amazon Web Services', category: 'Cloud Services', website: 'https://aws.amazon.com', order: 2, active: true },
    { id: 3, name: 'Google Cloud', category: 'Cloud Services', website: 'https://cloud.google.com', order: 3, active: true },
    { id: 4, name: 'IBM', category: 'Technology', website: 'https://ibm.com', order: 4, active: false },
    { id: 5, name: 'Oracle', category: 'Database', website: 'https://oracle.com', order: 5, active: true },
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
    
    // Simulate API call to fetch partners
    setTimeout(() => {
      setPartners(samplePartners);
      setLoading(false);
    }, 1000);
  }, [navigate]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      // Filter out the deleted partner
      setPartners(partners.filter(item => item.id !== id));
    }
  };

  const toggleActive = (id) => {
    setPartners(partners.map(item => 
      item.id === id ? { ...item, active: !item.active } : item
    ));
  };

  const moveUp = (id) => {
    const index = partners.findIndex(p => p.id === id);
    if (index > 0) {
      const newPartners = [...partners];
      const temp = newPartners[index].order;
      newPartners[index].order = newPartners[index - 1].order;
      newPartners[index - 1].order = temp;
      newPartners.sort((a, b) => a.order - b.order);
      setPartners(newPartners);
    }
  };

  const moveDown = (id) => {
    const index = partners.findIndex(p => p.id === id);
    if (index < partners.length - 1) {
      const newPartners = [...partners];
      const temp = newPartners[index].order;
      newPartners[index].order = newPartners[index + 1].order;
      newPartners[index + 1].order = temp;
      newPartners.sort((a, b) => a.order - b.order);
      setPartners(newPartners);
    }
  };

  const filteredPartners = partners.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
              placeholder="Search by name or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="filter-select">
            <option value="all">All Categories</option>
            <option value="technology">Technology</option>
            <option value="cloud-services">Cloud Services</option>
            <option value="database">Database</option>
          </select>
          <select className="filter-select">
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
                <th>Category</th>
                <th>Website</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartners.length > 0 ? (
                filteredPartners.map((item, index) => (
                  <tr key={item.id}>
                    <td className="order-column">
                      <div className="order-buttons">
                        <button 
                          onClick={() => moveUp(item.id)} 
                          disabled={index === 0}
                          className="order-btn"
                        >
                          <FaArrowUp />
                        </button>
                        <span>{item.order}</span>
                        <button 
                          onClick={() => moveDown(item.id)} 
                          disabled={index === partners.length - 1}
                          className="order-btn"
                        >
                          <FaArrowDown />
                        </button>
                      </div>
                    </td>
                    <td>
                      <img 
                        src={`/images/partners/${item.id}.png`} 
                        alt={item.name} 
                        className="partner-logo"
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>
                      <a href={item.website} target="_blank" rel="noopener noreferrer" className="website-link">
                        <FaLink /> {item.website}
                      </a>
                    </td>
                    <td>
                      <button 
                        onClick={() => toggleActive(item.id)} 
                        className={`status-toggle ${item.active ? 'active' : 'inactive'}`}
                      >
                        {item.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="actions">
                      <Link to={`/dashboard/partners/edit/${item.id}`} className="btn-edit">
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
                  <td colSpan="7" className="no-data">No partners found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PartnersManagement;