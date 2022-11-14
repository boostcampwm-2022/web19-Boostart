import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { GlobalStyle } from './components/common/GlobalStyle';
import WelcomePage from './pages/WelcomePage';
import MainPage from './pages/MainPage';

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
