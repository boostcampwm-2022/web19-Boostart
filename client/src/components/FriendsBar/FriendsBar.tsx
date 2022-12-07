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
  const [friendMenuId, setFriendMenuId] = useState<string | null>(null);

  const ProfileBox = ({ userId, profileImg }: ProfileBoxProps) => {
    const [currentVisit, setCurrentVisit] = useRecoilState(visitState);

    const closeFriendMenuModal = () => {
      setFriendMenuId(null);
      document.removeEventListener('click', closeFriendMenuModal);
    };
    const handleRightClick = (e: React.MouseEvent, userId: string) => {
      e.preventDefault();
      setFriendMenuId(userId);
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
            onContextMenu={(e) => handleRightClick(e, userId)}
            nowVisiting={currentVisit.userId === userId}
          ></S.ProfileBox>
          {friendMenuId === userId && userId !== myProfile?.userId && <FriendMenuModal></FriendMenuModal>}
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
        <S.ProfileBox userId={'친구 추가'} imgURL={plusIcon} onClick={handlePlusButtonClick}></S.ProfileBox>
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
