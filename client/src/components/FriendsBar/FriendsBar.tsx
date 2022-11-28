import React from 'react';
import { Friend } from 'GlobalType';
import * as S from './FriendsBar.style';

interface FriendsBarProps {
  myProfile: Friend | null;
  friendsList: Friend[] | null;
}

const FriendsBar = ({ myProfile, friendsList }: FriendsBarProps) => {
  const plusIcon = '/plus.svg';

  return (
    <>
      <S.FriendsBarContainer>
        {myProfile && <S.ProfileBox imgURL={myProfile.profile_img}></S.ProfileBox>}
        {friendsList &&
          friendsList.map(({ idx, userId, profile_img }) => {
            return <S.ProfileBox key={userId} data-idx={idx} imgURL={profile_img}></S.ProfileBox>;
          })}
        <S.ProfileBox imgURL={plusIcon}></S.ProfileBox>
      </S.FriendsBarContainer>
    </>
  );
};

export default FriendsBar;
