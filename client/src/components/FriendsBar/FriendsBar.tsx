import React, { useState, useRef, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Friend } from 'GlobalType';
import { sendUnfriendRequest } from './FriendsBarAPI';
import * as S from './FriendsBar.style';
import { visitState } from '../common/atoms';
import Modal from '../common/Modal';
import { MODAL_CENTER_TOP, MODAL_CENTER_LEFT, MODAL_CENTER_TRANSFORM, HOST } from '../../constants/index';
import { ProfileImage } from '../Drawer/Drawer.style';

interface FriendsBarProps {
  myProfile: Friend | null;
  friendsList: Friend[] | null;
  setFriendsList: React.Dispatch<Friend[] | null>;
  handlePlusButtonClick: React.MouseEventHandler;
}

interface FriendMenuModalProps {
  setIsDoubleCheckMdoalOpen: React.Dispatch<boolean>;
  setIsFriendProfileOpen: React.Dispatch<boolean>;
}

interface DoubleCheckModalProps {
  friend: Friend;
  handleAcceptClick: (e: React.MouseEvent, idx: number) => Promise<void>;
  handleCancleClick: (e: React.MouseEvent) => void;
}
interface FriendProfileModalProps {
  userId: string;
  username: string;
  profileImg: string;
}

const FriendsBar = ({ myProfile, friendsList, setFriendsList, handlePlusButtonClick }: FriendsBarProps) => {
  const plusIcon = '/plus.svg';
  const [currentFriendOnMenu, setCurrentFriendOnMenu] = useState<Friend | null>(null);
  const [isDoubleCheckModalOpen, setIsDoubleCheckMdoalOpen] = useState(false);
  const [isFriendProfileOpen, setIsFriendProfileOpen] = useState(false);

  const ProfileBox = ({ profileData }: { profileData: Friend }) => {
    const { idx, userId, profileImg } = profileData;
    const [currentVisit, setCurrentVisit] = useRecoilState(visitState);

    const closeFriendMenuModal = () => {
      setCurrentFriendOnMenu(null);
      document.removeEventListener('click', closeFriendMenuModal);
    };
    const handleRightClick = (e: React.MouseEvent) => {
      e.preventDefault();
      setCurrentFriendOnMenu(profileData);
      document.addEventListener('click', closeFriendMenuModal);
    };
    return (
      <>
        <div>
          <S.ProfileBox
            userId={userId}
            imgURL={profileImg}
            onClick={() => {
              setCurrentVisit({ userId: userId, isMe: myProfile!.userId === userId });
            }}
            onContextMenu={(e) => handleRightClick(e)}
            nowVisiting={currentVisit.userId === userId}
          ></S.ProfileBox>
          {currentFriendOnMenu?.userId === userId && userId !== myProfile?.userId && <FriendMenuModal setIsDoubleCheckMdoalOpen={setIsDoubleCheckMdoalOpen} setIsFriendProfileOpen={setIsFriendProfileOpen}></FriendMenuModal>}
        </div>
      </>
    );
  };
  const closeDoubleCheckModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDoubleCheckMdoalOpen(false);
  };
  const unfollowFriend = async (e: React.MouseEvent, unfollowingIdx: number) => {
    e.stopPropagation();
    const response = await sendUnfriendRequest(unfollowingIdx);
    if (!friendsList || !response) return;
    setFriendsList([...friendsList.filter(({ idx }) => idx !== unfollowingIdx)]);
    setIsDoubleCheckMdoalOpen(false);
  };

  const closeFriendProfileModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFriendProfileOpen(false);
  };

  return (
    <>
      <S.FriendsBarContainer>
        {myProfile && <ProfileBox profileData={myProfile} />}
        {friendsList &&
          friendsList.map((friend) => {
            return <ProfileBox key={friend.userId} profileData={friend} />;
          })}
        <S.ProfileBox userId={'친구 추가'} imgURL={plusIcon} onClick={handlePlusButtonClick}></S.ProfileBox>
      </S.FriendsBarContainer>
      {isDoubleCheckModalOpen && currentFriendOnMenu !== null && (
        <Modal
          component={<UnfriendDoubleCheckModal friend={currentFriendOnMenu} handleAcceptClick={unfollowFriend} handleCancleClick={closeDoubleCheckModal} />}
          top={MODAL_CENTER_TOP}
          left={MODAL_CENTER_LEFT}
          transform={MODAL_CENTER_TRANSFORM}
          zIndex={1000}
          handleDimmedClick={(e) => closeDoubleCheckModal(e)}
        />
      )}
      {isFriendProfileOpen &&
        friendsList
          ?.filter(({ userId }) => userId === currentFriendOnMenu!.userId)
          .map(({ userId, username, profileImg }) => {
            return (
              <Modal
                key={'profile' + userId}
                component={<FriendProfileModal userId={userId} username={username} profileImg={profileImg} />}
                top={MODAL_CENTER_TOP}
                left={MODAL_CENTER_LEFT}
                transform={MODAL_CENTER_TRANSFORM}
                zIndex={1000}
                handleDimmedClick={(e) => closeFriendProfileModal(e)}
              />
            );
          })}
    </>
  );
};

export default FriendsBar;

const FriendMenuModal = ({ setIsDoubleCheckMdoalOpen, setIsFriendProfileOpen }: FriendMenuModalProps) => {
  const openDoubleCheckModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDoubleCheckMdoalOpen(true);
  };
  const openFriendProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFriendProfileOpen(true);
  };
  return (
    <>
      <S.FriendMenuModal>
        <S.FriendMenuModalItem onClick={(e) => openFriendProfile(e)}>프로필보기</S.FriendMenuModalItem>
        <S.FriendMenuModalItem onClick={(e) => openDoubleCheckModal(e)}>삭제하기</S.FriendMenuModalItem>
      </S.FriendMenuModal>
    </>
  );
};

const UnfriendDoubleCheckModal = ({ friend, handleAcceptClick, handleCancleClick }: DoubleCheckModalProps) => {
  const removePointerEvents = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  return (
    <S.DoubleCheckContainer onClick={(e) => removePointerEvents(e)}>
      <span>정말로 {friend.username}님을 친구에서 삭제하시겠습니까?</span>
      <S.StyledButton onClick={(e) => handleAcceptClick(e, friend.idx)}> Accept </S.StyledButton>
      <S.StyledButton onClick={(e) => handleCancleClick(e)}> Cancle </S.StyledButton>
    </S.DoubleCheckContainer>
  );
};
const FriendProfileModal = ({ userId, username, profileImg }: FriendProfileModalProps) => {
  const removePointerEvents = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  return (
    <S.FriendProfileContainer onClick={(e) => removePointerEvents(e)}>
      <ProfileImage padding="2rem" size="10rem" src={HOST + '/' + profileImg}></ProfileImage>
      <S.FriendProfileInfo>
        <S.FriendProfileName>
          <strong>{username}</strong>님
        </S.FriendProfileName>
        <S.FriendProfileId>@{userId}</S.FriendProfileId>
      </S.FriendProfileInfo>
    </S.FriendProfileContainer>
  );
};
