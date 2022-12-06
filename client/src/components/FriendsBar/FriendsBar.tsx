import React, { useState, useRef, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Friend } from 'GlobalType';
import * as S from './FriendsBar.style';
import { visitState } from '../common/atoms';

interface FriendsBarProps {
  myProfile: Friend | null;
  friendsList: Friend[] | null;
  handlePlusButtonClick: React.MouseEventHandler;
}
interface ProfileBoxProps {
  userId: string;
  profileImg: string;
}

const FriendsBar = ({ myProfile, friendsList, handlePlusButtonClick }: FriendsBarProps) => {
  const plusIcon = '/plus.svg';
  const [friendMenuIndex, setFriendMenuIndex] = useState<string | null>(null);

  const ProfileBox = ({ userId, profileImg }: ProfileBoxProps) => {
    const [currentVisit, setCurrentVisit] = useRecoilState(visitState);

    const closeFriendMenuModal = () => {
      setFriendMenuIndex(null);
      document.removeEventListener('click', closeFriendMenuModal);
    };
    const handleRightClick = (e: React.MouseEvent, userId: string) => {
      e.preventDefault();
      setFriendMenuIndex(userId);
      document.addEventListener('click', closeFriendMenuModal);
    };
    return (
      <>
        <div>
          <S.ProfileBox
            imgURL={profileImg}
            onClick={() => {
              setCurrentVisit({ userId: userId, isMe: myProfile!.userId === userId });
            }}
            onContextMenu={(e) => handleRightClick(e, userId)}
            nowVisiting={currentVisit.userId === userId}
          ></S.ProfileBox>
          {friendMenuIndex === userId && userId !== myProfile?.userId && <FriendMenuModal></FriendMenuModal>}
        </div>
      </>
    );
  };

  return (
    <>
      <S.FriendsBarContainer>
        {myProfile && <ProfileBox userId={myProfile.userId} profileImg={myProfile.profileImg} />}
        {friendsList &&
          friendsList.map(({ userId, profileImg }) => {
            return <ProfileBox key={userId} userId={userId} profileImg={profileImg} />;
          })}
        <S.ProfileBox imgURL={plusIcon} onClick={handlePlusButtonClick}></S.ProfileBox>
      </S.FriendsBarContainer>
    </>
  );
};

export default FriendsBar;

const FriendMenuModal = () => {
  return (
    <>
      <S.FriendMenuModal>
        <S.FriendMenuModalItem>프로필보기</S.FriendMenuModalItem>
        <S.FriendMenuModalItem>삭제하기</S.FriendMenuModalItem>
      </S.FriendMenuModal>
    </>
  );
};
