import { useState } from 'react';
import { FriendsList } from 'GlobalType';
import { dummyFriendList } from '../../common/dummy';
import * as S from './style';

const FriendsBar = () => {
  const [friendsList, setFriendsList] = useState<FriendsList[]>(dummyFriendList);
  const plusIcon = './plus.svg';
  return (
    <>
      <S.FriendsBarContainer>
        {friendsList.map(({ idx, userId, username, profileImg }) => {
          return <S.ProfileBox key={idx} data-idx={idx} data-id={userId} data-name={username} imgURL={profileImg}></S.ProfileBox>;
        })}
        <S.ProfileBox imgURL={plusIcon}></S.ProfileBox>
      </S.FriendsBarContainer>
    </>
  );
};

export default FriendsBar;
