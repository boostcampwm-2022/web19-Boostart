import React, { useState, useRef, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Friend } from 'GlobalType';
import * as S from './FriendsBar.style';
import { visitState } from '../common/atoms';
import Modal from '../common/Modal';
import {MODAL_CENTER_TOP, MODAL_CENTER_LEFT, MODAL_CENTER_TRANSFORM, HOST} from '../../constants/index'
import {ProfileImage} from '../Drawer/Drawer.style'

interface FriendsBarProps {
  myProfile: Friend | null;
  friendsList: Friend[] | null;
  handlePlusButtonClick: React.MouseEventHandler;
}
interface ProfileBoxProps {
  userId: string;
  profileImg: string;
}
interface FriendMenuModalProps{
  setIsFriendProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
interface FriendProfileModalProps{
  userId: string;
  username:string;
  profileImg:string;
}

const FriendsBar = ({ myProfile, friendsList, handlePlusButtonClick }: FriendsBarProps) => {
  const plusIcon = '/plus.svg';
  const [friendMenuId, setFriendMenuId] = useState<string | null>(null);
  const [isFriendProfileOpen, setIsFriendProfileOpen] = useState(false)

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
          {friendMenuId === userId && userId !== myProfile?.userId && <FriendMenuModal setIsFriendProfileOpen={setIsFriendProfileOpen}></FriendMenuModal>}
        </div>
      </>
    );
  };

  const closeFriendProfileModal = (e:React.MouseEvent)=>{
    e.stopPropagation();
    setIsFriendProfileOpen(false)
  }

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
      {isFriendProfileOpen&&
      friendsList?.filter(({userId})=>userId===friendMenuId)
      .map(({userId, username, profileImg})=>{
        return <Modal key={'profile'+userId} component={<FriendProfileModal userId={userId} username={username} profileImg={profileImg}/>} top={MODAL_CENTER_TOP} left={MODAL_CENTER_LEFT} transform={MODAL_CENTER_TRANSFORM} zIndex={1000} handleDimmedClick={(e) => closeFriendProfileModal(e)} />
      })}
      </>
  );
};

export default FriendsBar;

const FriendMenuModal = ({setIsFriendProfileOpen}:FriendMenuModalProps) => {
  const openFriendProfile = (e:React.MouseEvent)=>{
    e.stopPropagation()
    setIsFriendProfileOpen(true)
  }
  return (
    <>
      <S.FriendMenuModal>
        <S.FriendMenuModalItem onClick={(e)=>openFriendProfile(e)}>프로필보기</S.FriendMenuModalItem>
        <S.FriendMenuModalItem>삭제하기</S.FriendMenuModalItem>
      </S.FriendMenuModal>
    </>
  );
};

const FriendProfileModal=({userId, username, profileImg}:FriendProfileModalProps)=>{
  return (
    <S.FriendProfileContainer>
      <ProfileImage padding="2rem" size="10rem" src={HOST + '/' + profileImg}></ProfileImage>
    <S.FriendProfileInfo>
      <S.FriendProfileName><strong>{username}</strong>님</S.FriendProfileName>
      <S.FriendProfileId>@{userId}</S.FriendProfileId>
    </S.FriendProfileInfo>
    </S.FriendProfileContainer>
  )
}
