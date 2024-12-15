import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Your Home component
import MovieDetailPage from './pages/MovieDetailPage'; // Optional, for movie detail page

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;
