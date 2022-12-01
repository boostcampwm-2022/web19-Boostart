import React from 'react';
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

const ProfileBox = ({ userId, profileImg }: ProfileBoxProps) => {
  const [currentVisit, setCurrentVisit] = useRecoilState(visitState);
  return <S.ProfileBox imgURL={profileImg} onClick={() => setCurrentVisit(userId)}></S.ProfileBox>;
};
