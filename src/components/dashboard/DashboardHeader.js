import React from 'react';

function DashboardHeader() {
  return (
    <div className="dashboard-header">
      <div className="header-search">
        <input type="text" placeholder="Search..." />
      </div>
      <div className="header-user">
        <img src="/images/avatar.png" alt="User" className="avatar" />
        <span>John Doe</span>
      </div>
    </div>
  );
}

export default DashboardHeader;