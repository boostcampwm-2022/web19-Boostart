import React, { useState } from 'react';
import FriendsBar from '../components/FriendsBar/FriendsBar';
import MainContents from '../components/MainContainer/MainContainer';
import Drawer from '../components/Drawer/Drawer';
import GNB from '../components/TopBar/TopBar';
import { DRAWER_RIGHT, DRAWER_TOP, DRAWER_Z_INDEX } from '../components/Drawer/Drawer.style';
import Modal from '../components/Drawer/Modal';

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
      {isDrawerOpen && (
        <Modal
          component={<Drawer />}
          zIndex={DRAWER_Z_INDEX}
          top={DRAWER_TOP}
          right={DRAWER_RIGHT}
          handleDimmedClick={() => {
            setIsDrawerOpen(false);
          }}
        />
      )}
    </>
  );
};

export default MainPage;
