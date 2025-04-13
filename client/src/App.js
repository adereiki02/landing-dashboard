import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import NewsDetail from './pages/DetailBerita/NewsDetail';
import NewsList from './pages/Berita/NewsList';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProtectedRoute from './components/common/ProtectedRoute';
import './styles/Landing.css';
import './styles/Dashboard.css';
import './styles/Auth.css';

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
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/berita" element={<NewsList />} />
        <Route path="/berita/:id" element={<NewsDetail />} />
      </Routes>
    </Router>
  );
}

export default App;