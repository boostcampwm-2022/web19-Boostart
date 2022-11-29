import React from 'react';
import { Friend } from 'GlobalType';
import * as S from './FriendsBar.style';

interface FriendsBarProps {
  myProfile: Friend | null;
  friendsList: Friend[] | null;
  handlePlusButtonClick: React.MouseEventHandler;
}
const FriendsBar = ({ myProfile, friendsList, handlePlusButtonClick }: FriendsBarProps) => {
  const plusIcon = '/plus.svg';

  return (
    <>
      <S.FriendsBarContainer>
        {myProfile && <S.ProfileBox imgURL={myProfile.profileImg}></S.ProfileBox>}
        {friendsList &&
          friendsList.map(({ idx, userId, profileImg }) => {
            return <S.ProfileBox key={userId} data-idx={idx} imgURL={profileImg}></S.ProfileBox>;
          })}
        <S.ProfileBox imgURL={plusIcon} onClick={handlePlusButtonClick}></S.ProfileBox>
      </S.FriendsBarContainer>
    </>
  );
};

export default FriendsBar;
