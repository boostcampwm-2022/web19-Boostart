import React, { useState, useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import axios from 'axios';
import { HOST } from '../constants';
import { Friend } from 'GlobalType';
import FriendsBar from '../components/FriendsBar/FriendsBar';
import MainContents from '../components/MainContainer/MainContainer';
import Drawer from '../components/Drawer/Drawer';
import GNB from '../components/TopBar/TopBar';
import { DRAWER_Z_INDEX } from '../components/Drawer/Drawer.style';
import { Dimmed } from '../components/Drawer/Modal';

const MainPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
      <GNB handleMenuClick={() => setIsDrawerOpen(true)} />
      <FriendsBar myProfile={myProfile} friendsList={friendsList} />
      <MainContents />
      {isDrawerOpen && <Dimmed zIndex={DRAWER_Z_INDEX - 1} onClick={() => setIsDrawerOpen(false)} />}
      <Drawer open={isDrawerOpen} />
    </RecoilRoot>
  );
};

export default MainPage;
