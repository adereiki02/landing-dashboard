import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaNewspaper, FaBriefcase, FaHandshake, FaCog, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/Dashboard.css';
import { useSettings } from '../../context/SettingsContext';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { settings } = useSettings();
  
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={settings.logo} alt={settings.siteName} className="sidebar-logo" />
      </div>
      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="user-info">
          <h4>{user?.name || 'User'}</h4>
          <p>{user?.role || 'Admin'}</p>
        </div>
      </div>
      <ul className="sidebar-menu">
        <li className={location.pathname === '/dashboard' ? 'active' : ''}>
          <Link to="/dashboard"><FaHome /> Dashboard</Link>
        </li>
        <li className={location.pathname === '/dashboard/news' ? 'active' : ''}>
          <Link to="/dashboard/news"><FaNewspaper /> News Management</Link>
        </li>
        <li className={location.pathname === '/dashboard/portfolio' ? 'active' : ''}>
          <Link to="/dashboard/portfolio"><FaBriefcase /> Portfolio Management</Link>
        </li>
        <li className={location.pathname === '/dashboard/partners' ? 'active' : ''}>
          <Link to="/dashboard/partners"><FaHandshake /> Partners Management</Link>
        </li>
        <li className={location.pathname === '/dashboard/settings' ? 'active' : ''}>
          <Link to="/dashboard/settings"><FaCog /> Website Settings</Link>
        </li>
      </ul>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;