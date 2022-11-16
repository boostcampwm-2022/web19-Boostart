import React from 'react';
import FriendsBar from '../components/MainPage/FriendsBar';
import MainContents from '../components/MainPage/MainContents';
import GNB from '../components/MainPage/TopBar';

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
