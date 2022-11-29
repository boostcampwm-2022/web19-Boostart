import React, { useState, useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import axios from 'axios';
import { HOST } from '../constants';
import { Friend } from 'GlobalType';
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
  const [myProfile, setMyProfile] = useState<Friend | null>(null);
  const [friendsList, setFriendsList] = useState<Friend[] | null>(null);

  const getFriendsList = async () => {
    try {
      setFriendsList(null);
      const response = await axios.get(`${HOST}/api/v1/friend`);
      setFriendsList(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getMyProfile = async () => {
    try {
      const response = await axios.get(`${HOST}/api/v1/user/me`);
      setMyProfile(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFriendsList();
    getMyProfile();
  }, []);

  return (
    <RecoilRoot>
      <TopBar handleMenuClick={() => setIsDrawerOpen(true)} />
      <FriendsBar myProfile={myProfile} friendsList={friendsList} handlePlusButtonClick={() => setIsFriendSearchFormOpen(true)} />
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
