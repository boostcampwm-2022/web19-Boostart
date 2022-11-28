import React, { useState } from 'react';
import { RecoilRoot } from 'recoil';
import FriendsBar from '../components/FriendsBar/FriendsBar';
import MainContents from '../components/MainContainer/MainContainer';
import Drawer from '../components/Drawer/Drawer';
import GNB from '../components/TopBar/TopBar';
import { DRAWER_Z_INDEX } from '../components/Drawer/Drawer.style';
import { Dimmed } from '../components/common/Modal';

const MainPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <RecoilRoot>
      <GNB handleMenuClick={() => setIsDrawerOpen(true)} />
      <FriendsBar />
      <MainContents />
      {isDrawerOpen && <Dimmed zIndex={DRAWER_Z_INDEX - 1} onClick={() => setIsDrawerOpen(false)} />}
      <Drawer open={isDrawerOpen} />
    </RecoilRoot>
  );
};

export default MainPage;
