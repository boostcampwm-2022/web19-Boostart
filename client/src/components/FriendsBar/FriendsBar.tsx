import React, { useState, useRef, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Friend } from 'GlobalType';
import {sendUnfriendRequest} from './FriendsBarAPI'
import * as S from './FriendsBar.style';
import { visitState } from '../common/atoms';
import Modal from '../common/Modal';
import { MODAL_CENTER_LEFT, MODAL_CENTER_TRANSFORM, MODAL_CENTER_TOP } from '../../constants';

interface FriendsBarProps {
  myProfile: Friend | null;
  friendsList: Friend[] | null;
  setFriendsList:React.Dispatch<Friend[]|null>
  handlePlusButtonClick: React.MouseEventHandler;
}

interface FriendMenuModalProps{
  friendIdx: number;
  setIsDoubleCheckMdoalOpen:React.Dispatch<boolean>;
}
interface DoubleCheckModalProps{
  friend:Friend;
  handleAcceptClick:(e:React.MouseEvent, idx:number)=>Promise<void>;
  handleCancleClick:(e:React.MouseEvent)=>void;
}

const FriendsBar = ({ myProfile, friendsList,setFriendsList, handlePlusButtonClick }: FriendsBarProps) => {
  const plusIcon = '/plus.svg';
  const [currentFriendOnMenu, setCurrentFriendOnMenu] = useState<Friend | null>(null);
  const [isDoubleCheckModalOpen, setIsDoubleCheckMdoalOpen] = useState(false)

  const ProfileBox = ({ profileData }: {profileData:Friend}) => {
    const {idx, userId, profileImg} = profileData
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
          {currentFriendOnMenu?.userId === userId && userId !== myProfile?.userId && <FriendMenuModal friendIdx={idx} setIsDoubleCheckMdoalOpen={setIsDoubleCheckMdoalOpen}></FriendMenuModal>}
        </div>
      </>
    );
  };
  const closeDoubleCheckModal=(e:React.MouseEvent) =>{
    e.stopPropagation()
    setIsDoubleCheckMdoalOpen(false)
  }
  const unfollowFriend = async (e:React.MouseEvent, unfollowingIdx:number) =>{
    e.stopPropagation()
    const response = await sendUnfriendRequest(unfollowingIdx);
    if(!friendsList||!response) return;
    setFriendsList([...friendsList.filter(({idx})=>idx!==unfollowingIdx)])
  }
  return (
    <>
      <S.FriendsBarContainer>
        {myProfile && <ProfileBox profileData={myProfile} />}
        {friendsList &&
          friendsList.map((friend) => {
            return <ProfileBox key={friend.userId} profileData ={friend} />;
          })}
        <S.ProfileBox userId={'친구 추가'} imgURL={plusIcon} onClick={handlePlusButtonClick}></S.ProfileBox>
      </S.FriendsBarContainer>
          {isDoubleCheckModalOpen&&currentFriendOnMenu!==null&&<Modal component={<UnfriendDoubleCheckModal friend={currentFriendOnMenu} handleAcceptClick={unfollowFriend} handleCancleClick={closeDoubleCheckModal} />} top={MODAL_CENTER_TOP} left={MODAL_CENTER_LEFT} transform={MODAL_CENTER_TRANSFORM} zIndex={1000} handleDimmedClick={(e)=>closeDoubleCheckModal(e)} />}
    </>
  );
};

export default FriendsBar;

const FriendMenuModal = ({setIsDoubleCheckMdoalOpen}:FriendMenuModalProps) => {
  const openDoubleCheckModal = (e:React.MouseEvent) =>{
    e.stopPropagation()
    setIsDoubleCheckMdoalOpen(true)
  }
  return (
    <>
      <S.FriendMenuModal>
        <S.FriendMenuModalItem>프로필보기</S.FriendMenuModalItem>
        <S.FriendMenuModalItem onClick={(e)=>openDoubleCheckModal(e)}>삭제하기</S.FriendMenuModalItem>
      </S.FriendMenuModal>
    </>
  );
};

const UnfriendDoubleCheckModal = ({friend ,handleAcceptClick, handleCancleClick}:DoubleCheckModalProps) => {
  const stop = (e:React.MouseEvent)=>{
    e.stopPropagation();
  }
  return (
    <S.DoubleCheckContainer onClick={(e)=>stop(e)}>
      <span>정말로 {friend.username}님을 친구에서 삭제하시겠습니까?</span>
      <S.StyledButton onClick={(e)=>handleAcceptClick(e, friend.idx)}> Accept </S.StyledButton>
      <S.StyledButton onClick={(e)=>handleCancleClick(e)}> Cancle </S.StyledButton>
    </S.DoubleCheckContainer>   
  )
}