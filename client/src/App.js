import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Helmet } from 'react-helmet';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import NewsDetail from './pages/DetailBerita/NewsDetail';
import NewsList from './pages/Berita/NewsList';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import NewsManagement from './pages/Dashboard/NewsManagement';
import PortfolioManagement from './pages/Dashboard/PortfolioManagement';
import PartnersManagement from './pages/Dashboard/PartnersManagement';
import WebsiteSettings from './pages/Dashboard/WebsiteSettings';
import PartnerForm from './components/dashboard/PartnerForm';
import NewsForm from './components/dashboard/NewsForm';
import ProtectedRoute from './components/common/ProtectedRoute';
import './styles/Landing.css';
import './styles/Dashboard.css';
import './styles/Auth.css';
import './styles/NewsDetail.css';
import './styles/NewsList.css';

// Set base URL for axios
axios.defaults.baseURL = 'http://localhost:5000';

function App() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);
      
      // Set auth token for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUserInfo.token}`;
    }
  }, []);

  return (
    <Router>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0D8ABC" />
        <link rel="icon" href="/favicon.ico" />
        <title>reikidevs - Digital Agency</title>
        <meta name="description" content="reikidevs adalah digital agency yang menyediakan layanan pengembangan web, aplikasi mobile, dan solusi digital untuk bisnis Anda." />
      </Helmet>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/news" element={
          <ProtectedRoute>
            <NewsManagement />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/portfolio" element={
          <ProtectedRoute>
            <PortfolioManagement />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/partners" element={
          <ProtectedRoute>
            <PartnersManagement />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/partners/create" element={
          <ProtectedRoute>
            <PartnerForm />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/partners/edit/:id" element={
          <ProtectedRoute>
            <PartnerForm />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/news/create" element={
          <ProtectedRoute>
            <NewsForm />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/news/edit/:id" element={
          <ProtectedRoute>
            <NewsForm />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/settings" element={
          <ProtectedRoute>
            <WebsiteSettings />
          </ProtectedRoute>
        } />
        
        {/* Public Routes */}
        <Route path="/berita" element={<NewsList />} />
        <Route path="/berita/:id" element={<NewsDetail />} />
      </Routes>
      <SpeedInsights />
    </Router>
  );
}

export default App;