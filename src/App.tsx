import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Upload } from './pages/Upload';
import { Result } from './pages/Result';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/result/:id" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;
