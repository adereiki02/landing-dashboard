import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './utils/axiosConfig'; // Import axios configuration
import { SettingsProvider } from './context/SettingsContext';
import DynamicHelmet from './components/common/DynamicHelmet';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import NewsDetail from './pages/DetailBerita/NewsDetail';
import NewsList from './pages/Berita/NewsList';
import ListPortfolio from './pages/Portfolio/ListPortfolio';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import NewsManagement from './pages/Dashboard/NewsManagement';
import PortfolioManagement from './pages/Dashboard/PortfolioManagement';
import PartnersManagement from './pages/Dashboard/PartnersManagement';
import WebsiteSettings from './pages/Dashboard/WebsiteSettings';
import PartnerForm from './components/dashboard/PartnerForm';
import NewsForm from './components/dashboard/NewsForm';
import PortfolioForm from './components/dashboard/PortfolioForm';
import ProtectedRoute from './components/common/ProtectedRoute';
import './styles/Landing.css';
import './styles/Dashboard.css';
import './styles/Auth.css';
import './styles/NewsDetail.css';
import './styles/NewsList.css';
import './styles/pagination.css';
import './styles/PortfolioList.css';

function App() {
  const [, setUserInfo] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(parsedUserInfo);
    }
  }, []);

  return (
    <SettingsProvider>
      <Router>
        <DynamicHelmet />
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
          <Route path="/dashboard/portfolio/create" element={
            <ProtectedRoute>
              <PortfolioForm />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/portfolio/edit/:id" element={
            <ProtectedRoute>
              <PortfolioForm />
            </ProtectedRoute>
          } />
          
          {/* Public Routes */}
          <Route path="/berita" element={<NewsList />} />
          <Route path="/berita/:id" element={<NewsDetail />} />
          <Route path="/portfolio" element={<ListPortfolio />} />
        </Routes>
        <SpeedInsights />
      </Router>
    </SettingsProvider>
  );
}

export default App;