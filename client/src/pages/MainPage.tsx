import React, { useState } from 'react';
import { RecoilRoot } from 'recoil';
import FriendsBar from '../components/FriendsBar/FriendsBar';
import MainContents from '../components/MainContainer/MainContainer';
import Drawer from '../components/Drawer/Drawer';
import TopBar from '../components/TopBar/TopBar';
import Modal, { Dimmed } from '../components/common/Modal';
import FriendSearchForm, { FRIEND_SEARCH_MODAL_ZINDEX } from '../components/FriendsBar/FriendSearchForm';
import { DRAWER_Z_INDEX } from '../components/Drawer/Drawer.style';
import { MODAL_CENTER_TOP, MODAL_CENTER_LEFT, MODAL_CENTER_TRANSFORM } from '../constants';

const MainPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFriendSearchFormOpen, setIsFriendSearchFormOpen] = useState(false);
  return (
    <RecoilRoot>
      <TopBar handleMenuClick={() => setIsDrawerOpen(true)} />
      <FriendsBar handlePlusButtonClick={() => setIsFriendSearchFormOpen(true)} />
      <MainContents />
      {isDrawerOpen && <Dimmed zIndex={DRAWER_Z_INDEX - 1} onClick={() => setIsDrawerOpen(false)} />}
      <Drawer open={isDrawerOpen} />
      {isFriendSearchFormOpen && (
        <Modal component={<FriendSearchForm />} top={MODAL_CENTER_TOP} left={MODAL_CENTER_LEFT} transform={MODAL_CENTER_TRANSFORM} zIndex={FRIEND_SEARCH_MODAL_ZINDEX} handleDimmedClick={() => setIsFriendSearchFormOpen(false)} />
      )}
    </RecoilRoot>
  );
};

export default MainPage;
