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
            <div className="chart-header">
              <h3><FaChartLine /> Visitor Trends</h3>
              <div className="chart-period">
                <select defaultValue="6months">
                  <option value="30days">Last 30 Days</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="1year">Last Year</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visitorData}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '10px'
                  }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '5px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  dot={{ stroke: '#8884d8', strokeWidth: 2, r: 4, fill: '#fff' }}
                  activeDot={{ r: 8, stroke: '#8884d8', strokeWidth: 2, fill: '#fff' }} 
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color visitors-color"></div>
                <span>Website Visitors</span>
              </div>
              <div className="legend-item">
                <span>Total: 30,500 visitors</span>
              </div>
            </div>
          </div>
          
          <div className="chart-container">
            <div className="chart-header">
              <h3><FaNewspaper /> Content Overview</h3>
              <div className="chart-period">
                <select defaultValue="current">
                  <option value="current">Current</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="lastQuarter">Last Quarter</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={contentData}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(130, 202, 157, 0.1)' }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '10px'
                  }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '5px' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#82ca9d" 
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color content-color"></div>
                <span>Content Items</span>
              </div>
              <div className="legend-item">
                <span>Total: 54 items</span>
              </div>
            </div>
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