import React from 'react';
import FriendsBar from '../components/FriendsBar/FriendsBar';
import MainContents from '../components/MainContainer/MainContainer';
import GNB from '../components/TopBar/TopBar';

const MainPage = () => {
  return (
    <>
      <GNB />
      <FriendsBar />
      <MainContents />
    </>
  );
};

export default MainPage;
