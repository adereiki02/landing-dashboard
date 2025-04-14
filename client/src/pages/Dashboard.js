import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import '../styles/Dashboard.css';
import { FaUsers, FaNewspaper, FaBriefcase, FaHandshake, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Default data for charts in case API fails
  const defaultVisitorData = [
    { name: 'Jan', visitors: 4000 },
    { name: 'Feb', visitors: 3000 },
    { name: 'Mar', visitors: 5000 },
    { name: 'Apr', visitors: 4500 },
    { name: 'May', visitors: 6000 },
    { name: 'Jun', visitors: 8000 },
  ];

  const defaultContentData = [
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
        return;
      }

      // Fetch dashboard data
      const fetchDashboardData = async () => {
        try {
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${parsedUser.token}`,
            },
          };

          const { data } = await axios.get('/api/dashboard/stats', config);
          setDashboardData(data);
          setError(null);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          setError('Failed to load dashboard data. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Use data from API or fallback to defaults if not available
  const visitorData = dashboardData?.charts?.visitorData || defaultVisitorData;
  const contentData = dashboardData?.charts?.contentData || defaultContentData;
  
  // Stats data
  const visitorStats = dashboardData?.stats?.visitors || { count: 24500, percentChange: 15, newThisMonth: 3675 };
  const newsStats = dashboardData?.stats?.news || { count: 24, percentChange: 15, newThisMonth: 3 };
  const portfolioStats = dashboardData?.stats?.portfolio || { count: 18, percentChange: 12, newThisMonth: 2 };
  const partnerStats = dashboardData?.stats?.partners || { count: 12, percentChange: 9, newThisMonth: 1 };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <DashboardHeader />
        <div className="dashboard-welcome">
          <h2>Welcome back, {user ? user.name : 'User'}!</h2>
          <p>Here's an overview of your website statistics</p>
        </div>
        
        {error && (
          <div className="error-notification">
            <FaExclamationTriangle /> {error}
          </div>
        )}
        
        <div className="dashboard-cards">
          <div className="card">
            <div className="card-inner">
              <h3>Total Visitors</h3>
              <FaUsers className="card-icon" />
            </div>
            <h1>{visitorStats.count.toLocaleString()}</h1>
            <p className="orange-notification">
              +{visitorStats.percentChange}% from last month
            </p>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>News Articles</h3>
              <FaNewspaper className="card-icon" />
            </div>
            <h1>{newsStats.count}</h1>
            <p className="orange-notification">
              {newsStats.newThisMonth > 0 ? `+${newsStats.newThisMonth} new this month` : 'No new articles this month'}
            </p>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>Portfolio Items</h3>
              <FaBriefcase className="card-icon" />
            </div>
            <h1>{portfolioStats.count}</h1>
            <p className="orange-notification">
              {portfolioStats.newThisMonth > 0 ? `+${portfolioStats.newThisMonth} new this month` : 'No new items this month'}
            </p>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>Partners</h3>
              <FaHandshake className="card-icon" />
            </div>
            <h1>{partnerStats.count}</h1>
            <p className="orange-notification">
              {partnerStats.newThisMonth > 0 ? `+${partnerStats.newThisMonth} new this month` : 'No new partners this month'}
            </p>
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
                  stroke="#0066FF" 
                  strokeWidth={3}
                  dot={{ stroke: '#0066FF', strokeWidth: 2, r: 4, fill: '#fff' }}
                  activeDot={{ r: 8, stroke: '#0066FF', strokeWidth: 2, fill: '#fff' }} 
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color visitors-color"></div>
                <span>Website Visitors</span>
              </div>
              <div className="legend-item">
                <span>Total: {visitorStats.count.toLocaleString()} visitors</span>
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
                  fill="#60A5FA" 
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
                <span>Total: {newsStats.count + portfolioStats.count + partnerStats.count} items</span>
              </div>
            </div>
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