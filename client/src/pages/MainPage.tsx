import React from 'react';
import { RecoilRoot } from 'recoil';
import FriendsBar from '../components/FriendsBar/FriendsBar';
import MainContents from '../components/MainContainer/MainContainer';
import GNB from '../components/TopBar/TopBar';

const MainPage = () => {
  return (
    <>
      <RecoilRoot>
        <GNB />
        <FriendsBar />
        <MainContents />
      </RecoilRoot>
    </>
  );
};

export default MainPage;
