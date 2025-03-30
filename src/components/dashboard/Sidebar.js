import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Dashboard</h3>
      </div>
      <ul className="sidebar-menu">
        <li className="active"><a href="#dashboard">Dashboard</a></li>
        <li><a href="#analytics">Analytics</a></li>
        <li><a href="#reports">Reports</a></li>
        <li><a href="#settings">Settings</a></li>
      </ul>
      <div className="sidebar-footer">
        <Link to="/" className="btn">Logout</Link>
      </div>
    </div>
  );
}

export default Sidebar;