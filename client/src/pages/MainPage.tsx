import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import axios, { AxiosStatic } from 'axios';
import { HOST } from '../constants';
import { Friend } from 'GlobalType';
import FriendsBar from '../components/FriendsBar/FriendsBar';
import MainContents from '../components/MainContainer/MainContainer';
import Drawer from '../components/Drawer/Drawer';
import TopBar from '../components/TopBar/TopBar';
import Modal, { Dimmed } from '../components/common/Modal';
import FriendSearchForm, { FRIEND_SEARCH_MODAL_ZINDEX } from '../components/FriendsBar/FriendSearchForm';
import { DRAWER_Z_INDEX } from '../components/Drawer/Drawer.style';
import { MODAL_CENTER_TOP, MODAL_CENTER_LEFT, MODAL_CENTER_TRANSFORM, RoutePath } from '../constants';

const MainPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFriendSearchFormOpen, setIsFriendSearchFormOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<number | null>(null);
  const [myProfile, setMyProfile] = useState<Friend | null>(null);
  const [friendsList, setFriendsList] = useState<Friend[] | null>(null);
  const [friendRequests, setFriendRequests] = useState<Friend[] | null>(null);

  //API Requests
  const getFriendsList = async () => {
    try {
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
    } catch (error) {
      console.log(error);
    }
  };

  const sendFriendRequest = async () => {
    try {
      const response = await axios.put(`${HOST}/api/v1/friend/request/${selectedFriend}`);
      if (response.status === 201) alert('친구요청을 완료했습니다');
    } catch (error: any) {
      alert(error.response.data.msg);
    }
    resetFriendSearchForm();
  };

  const getFriendRequests = async () => {
    try {
      const response = await axios.get(`${HOST}/api/v1/friend/request`);
      setFriendRequests(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFriendRequests = (action: AxiosStatic) => {
    return async function (userIdx: number) {
      try {
        const response = await action(`${HOST}/api/v1/friend/accept/${userIdx}`);
        alert(response.status);
      } catch (error) {
        console.log(error);
      }
      getFriendsList();
      getFriendRequests();
    };
  };

  const requestLogout = async () => {
    try {
      await axios.get(`${HOST}/api/v1/auth/logout`);
      alert('로그아웃되었습니다');
      window.location.href = '/';
    } catch (error) {
      console.log(error);
    }
  };

  //Event Handler
  const resetFriendSearchForm = () => {
    setIsFriendSearchFormOpen(false);
    setSelectedFriend(null);
  };

  useEffect(() => {
    getFriendsList();
    getMyProfile();
    getFriendRequests();
  }, []);

  return (
    <RecoilRoot>
      <TopBar handleMenuClick={() => setIsDrawerOpen(true)} />
      <FriendsBar myProfile={myProfile} friendsList={friendsList} handlePlusButtonClick={() => setIsFriendSearchFormOpen(true)} />
      <MainContents />
      {isDrawerOpen && <Dimmed zIndex={DRAWER_Z_INDEX - 1} onClick={() => setIsDrawerOpen(false)} />}
      <Drawer isOpen={isDrawerOpen} friendRequests={friendRequests} handleFriendRequests={handleFriendRequests} handleLogoutButtonClick={() => requestLogout()} />
      {isFriendSearchFormOpen && (
        <Modal
          component={<FriendSearchForm selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend} handleRequestButtonClick={() => sendFriendRequest()} />}
          top={MODAL_CENTER_TOP}
          left={MODAL_CENTER_LEFT}
          transform={MODAL_CENTER_TRANSFORM}
          zIndex={FRIEND_SEARCH_MODAL_ZINDEX}
          handleDimmedClick={() => resetFriendSearchForm()}
        />
      )}
    </RecoilRoot>
  );
};

export default MainPage;
