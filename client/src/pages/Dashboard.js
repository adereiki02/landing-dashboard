import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import '../styles/Dashboard.css';
import { FaUsers, FaNewspaper, FaBriefcase, FaHandshake, FaChartLine } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Sample data for charts
  const visitorData = [
    { name: 'Jan', visitors: 4000 },
    { name: 'Feb', visitors: 3000 },
    { name: 'Mar', visitors: 5000 },
    { name: 'Apr', visitors: 4500 },
    { name: 'May', visitors: 6000 },
    { name: 'Jun', visitors: 8000 },
  ];

  const contentData = [
    { name: 'News', count: 24 },
    { name: 'Portfolio', count: 18 },
    { name: 'Partners', count: 12 },
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
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <DashboardHeader />
        <div className="dashboard-welcome">
          <h2>Welcome back, {user ? user.name : 'User'}!</h2>
          <p>Here's an overview of your website statistics</p>
        </div>
        
        <div className="dashboard-cards">
          <div className="card">
            <div className="card-inner">
              <h3>Total Visitors</h3>
              <FaUsers className="card-icon" />
            </div>
            <h1>24,500</h1>
            <p>+15% from last month</p>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>News Articles</h3>
              <FaNewspaper className="card-icon" />
            </div>
            <h1>24</h1>
            <p>+3 new this month</p>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>Portfolio Items</h3>
              <FaBriefcase className="card-icon" />
            </div>
            <h1>18</h1>
            <p>+2 new this month</p>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>Partners</h3>
              <FaHandshake className="card-icon" />
            </div>
            <h1>12</h1>
            <p>+1 new this month</p>
          </div>
        </div>
        
        <div className="dashboard-charts">
          <div className="chart-container">
            <h3><FaChartLine /> Visitor Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="visitors" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="chart-container">
            <h3>Content Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="dashboard-quick-actions">
          <h3>Quick Actions</h3>
          <div className="quick-actions-buttons">
            <Link to="/dashboard/news" className="quick-action-btn">Manage News</Link>
            <Link to="/dashboard/portfolio" className="quick-action-btn">Manage Portfolio</Link>
            <Link to="/dashboard/partners" className="quick-action-btn">Manage Partners</Link>
            <Link to="/dashboard/settings" className="quick-action-btn">Website Settings</Link>
          </div>
        </div>
        
        <div className="back-to-home">
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;