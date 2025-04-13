import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Auth.css';
import reikiLogo from '../../assets/reikidevelop.png';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/login', formData);
      
      // Save user info to localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-container">
        <div className="auth-left-panel">
          <div className="auth-left-panel-content">
            <img src={reikiLogo} alt="ReikiDevelop Logo" className="auth-logo-centered" />
            <h1>Welcome Back to ReikiDevs</h1>
            <p>Login to access your dashboard, manage your projects, and connect with our developer community.</p>
            <img src="/images/login-illustration.svg" alt="Login Illustration" className="illustration" />
          </div>
        </div>
        
        <div className="auth-right-panel">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2>Sign In</h2>
              <p>Enter your credentials to access your account</p>
            </div>
            
            {error && <div className="auth-error">{error}</div>}
            
            <div className="social-buttons">
              <button className="social-button">
                <img src="/images/google-icon.svg" alt="Google" />
                Google
              </button>
              <button className="social-button">
                <img src="/images/github-icon.svg" alt="GitHub" />
                GitHub
              </button>
            </div>
            
            <div className="auth-divider">
              <span>or sign in with email</span>
            </div>
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Enter your username"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
              </div>
              
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
            <div className="auth-links">
              <p>
                Don't have an account?{' '}
                <Link to="/register">Sign up for free</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;