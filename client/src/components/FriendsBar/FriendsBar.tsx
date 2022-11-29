import { useState } from 'react';
import { FriendsList } from 'GlobalType';
import { dummyFriendList } from '../common/dummy';
import * as S from './FriendsBar.style';

const FriendsBar = () => {
  const [friendsList, setFriendsList] = useState<FriendsList[]>(dummyFriendList);
  const plusIcon = '/plus.svg';
  return (
    <>
      <S.FriendsBarContainer>
        {friendsList.map(({ idx, userId, profileImg }) => {
          return <S.ProfileBox key={userId} data-idx={idx} imgURL={profileImg}></S.ProfileBox>;
        })}
        <S.ProfileBox imgURL={plusIcon}></S.ProfileBox>
      </S.FriendsBarContainer>
    </>
  );
};

export default FriendsBar;
