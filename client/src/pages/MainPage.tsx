import React, { useState } from 'react';
import FriendsBar from '../components/FriendsBar/FriendsBar';
import MainContents from '../components/MainContainer/MainContainer';
import Drawer from '../components/Drawer/Drawer';
import GNB from '../components/TopBar/TopBar';

const MainPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleMenuClick = () => {
    setIsDrawerOpen(true);
  };

  return (
    <>
      <GNB handleMenuClick={handleMenuClick} />
      <FriendsBar />
      <MainContents />
      {isDrawerOpen && <Drawer handleDimmedClick={() => setIsDrawerOpen(false)} />}
    </>
  );
};

export default MainPage;
