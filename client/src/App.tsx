import React from 'react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import RestrictedRoute from './routes/RestrictedRoute';
import './App.css';
import { RoutePath } from './constants';
import { GlobalStyle } from './components/common/GlobalStyle';
import WelcomePage from './pages/WelcomePage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';
import Drawer from './components/Drawer/Drawer';

function App() {
  return (
    <RecoilRoot>
      <Router>
        <GlobalStyle />
        <Routes>
          <Route path={RoutePath.ROOT} element={<RestrictedRoute component={WelcomePage} />} />
          <Route path={RoutePath.SIGNUP} element={<SignupPage />} />
          <Route path={RoutePath.MAIN} element={<PrivateRoute component={MainPage} />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

export default App;
