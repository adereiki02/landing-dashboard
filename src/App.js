import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import NewsDetail from './pages/DetailBerita/NewsDetail';
import NewsList from './pages/Berita/NewsList';
import './styles/Landing.css';
import './styles/Dashboard.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/berita" element={<NewsList />} />
        <Route path="/berita/:id" element={<NewsDetail />} />
      </Routes>
    </Router>
  );
}

export default App;