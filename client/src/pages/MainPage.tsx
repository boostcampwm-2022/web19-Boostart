import React from 'react';
import { Navigate } from 'react-router-dom';
import GNB from '../components/MainPage/TopBar';
import { useAuthorization } from '../hooks/useAuthorization';

const MainPage = () => {
  const isLogined = useAuthorization();

  return <>{isLogined === undefined ? <p>Loading...</p> : isLogined === true ? <GNB /> : <Navigate to="/" replace={true} />}</>;
};

export default MainPage;
