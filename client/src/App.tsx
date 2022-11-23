import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import RestrictedRoute from './routes/RestrictedRoute';
import './App.css';
import { GlobalStyle } from './components/common/GlobalStyle';
import WelcomePage from './pages/WelcomePage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';
import Calendar from './components/MainContainer/Calendar';

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<RestrictedRoute component={WelcomePage} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/main/*" element={<PrivateRoute component={MainPage} />} />
      </Routes>
    </Router>
  );
}

export default App;
