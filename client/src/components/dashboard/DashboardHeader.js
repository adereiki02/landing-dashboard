import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaSignOutAlt } from 'react-icons/fa';

function DashboardHeader() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage
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
    <div className="dashboard-header">
      <div className="header-search">
        <FaSearch />
        <input type="text" placeholder="Search..." />
      </div>
      <div className="header-user">
        <div className="user-avatar">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <span>{user ? user.name : 'User'}</span>
        <button onClick={handleLogout} className="header-logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}

export default DashboardHeader;