import React, { useState, useEffect } from 'react';
import { AxiosStatic } from 'axios';
import { useRecoilState } from 'recoil';
import { visitState, friendState, myInfo } from '../components/common/atoms';
import { getMyProfile, getFriendsList, postFriendRequest, getFriendRequests, sendLogoutRequest } from '../components/FriendsBar/FriendsBarAPI';
import FriendsBar from '../components/FriendsBar/FriendsBar';
import MainContents from '../components/MainContainer/MainContainer';
import Drawer from '../components/Drawer/Drawer';
import TopBar from '../components/TopBar/TopBar';
import Modal, { Dimmed } from '../components/common/Modal';
import FriendSearchForm, { FRIEND_SEARCH_MODAL_ZINDEX } from '../components/FriendsBar/FriendSearchForm';
import { DRAWER_Z_INDEX } from '../components/Drawer/Drawer.style';
import { MODAL_CENTER_TOP, MODAL_CENTER_LEFT, MODAL_CENTER_TRANSFORM, HOST } from '../constants';
import styled from 'styled-components';
import globalSocket from '../components/common/Socket';

const MainPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFriendSearchFormOpen, setIsFriendSearchFormOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<number | null>(null);
  const [myProfile, setMyProfile] = useRecoilState<Friend | null>(myInfo);
  const [friendsList, setFriendsList] = useRecoilState(friendState);
  const [currentVisit, setCurrentVisit] = useRecoilState(visitState);
  const [friendRequests, setFriendRequests] = useState<Friend[] | null>(null);

  const sendFriendRequest = async () => {
    if (!selectedFriend) return;
    postFriendRequest(selectedFriend).then(() => {
      resetFriendSearchForm();
    });
  };

  const updateFriendRequestsList = async () => {
    getFriendRequests().then((requests) => setFriendRequests(requests));
  };

  const handleFriendRequests = (action: AxiosStatic) => {
    return async function (userIdx: number) {
      try {
        const response = await action(`${HOST}/api/v1/friend/accept/${userIdx}`);
        alert(response.status);
      } catch (error) {
        console.log(error);
      }
      getFriendsList().then((friendsData) => setFriendsList(friendsData));
      updateFriendRequestsList();
    };
  };

  const resetFriendSearchForm = () => {
    setIsFriendSearchFormOpen(false);
    setSelectedFriend(null);
  };

  useEffect(() => {
    getFriendsList().then((friendsData) => setFriendsList(friendsData));
    getMyProfile().then((userData: Friend) => {
      setMyProfile(userData);
      setCurrentVisit((prev) => ({ isMe: true, userId: userData.userId }));
    });
    updateFriendRequestsList();
  }, []);

  useEffect(() => {
    globalSocket.initialize();
    globalSocket.instance.emit('authenticate');
  }, []);

  return (
    <>
      <Container>
        <TopBar handleMenuClick={() => setIsDrawerOpen(true)} />
        <FriendsBar handlePlusButtonClick={() => setIsFriendSearchFormOpen(true)} />
        <MainContents />
        {isDrawerOpen && <Dimmed zIndex={DRAWER_Z_INDEX - 1} onClick={() => setIsDrawerOpen(false)} />}
        <Drawer isOpen={isDrawerOpen} friendRequests={friendRequests} handleFriendRequests={handleFriendRequests} />
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
      </Container>
    </>
  );
};

export default MainPage;

const Container = styled.div`
  display: grid;
`;
