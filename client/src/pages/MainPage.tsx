import React from 'react';
import { Navigate } from 'react-router-dom';
import FriendsBar from '../components/MainPage/FriendsBar';
import MainContents from '../components/MainPage/MainContents';
import GNB from '../components/MainPage/TopBar';
import { useAuthorization } from '../hooks/useAuthorization';

const MainPage = () => {
  const isLogined = useAuthorization();

  return (
    <>
      {isLogined === undefined ? (
        <p>Loading...</p>
      ) : isLogined === true ? (
        <>
          <GNB />
          <FriendsBar />
          <MainContents />
        </>
      ) : (
        <Navigate to="/" replace={true} />
      )}
    </>
  );
};

export default MainPage;
