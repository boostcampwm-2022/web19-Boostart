import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginMenu from '../components/WelcomePage/LoginMenu';
import { useAuthorization } from '../hooks/useAuthorization';

const WelcomePage = () => {
  const isLogined = useAuthorization();

  return <>{isLogined === undefined ? <p>Loading...</p> : isLogined === false ? <LoginMenu /> : <Navigate to="/main" replace={true} />}</>;
};

export default WelcomePage;
