import React, { useEffect, useState } from 'react';
import { FriendList } from 'GlobalType';
import * as S from './style';
import { dummyFriendList } from '../../common/dummy';
const FriendsBar = () => {
  const [friendList, setFriendList] = useState<FriendList[]>(dummyFriendList);
  const plusIcon = './plus.svg';
  return (
    <>
      <S.FriendsBarContainer>
        {friendList.map(({ idx, userId, username, profileImg }) => {
          return <S.ProfileBox key={idx} data-idx={idx} data-id={userId} data-name={username} imgURL={profileImg}></S.ProfileBox>;
        })}
        <S.ProfileBox imgURL={plusIcon}></S.ProfileBox>
      </S.FriendsBarContainer>
    </>
  );
};

export default FriendsBar;
