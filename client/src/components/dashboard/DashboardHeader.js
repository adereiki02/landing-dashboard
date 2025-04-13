import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <input type="text" placeholder="Search..." />
      </div>
      <div className="header-user">
        <img src="/images/avatar.png" alt="User" className="avatar" />
        <span>{user ? user.name : 'User'}</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
}

export default DashboardHeader;