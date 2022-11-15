import React, { useEffect, useState } from 'react';
import { FriendsList } from 'GlobalType';
import * as S from './style';

const FriendsBar = () => {
  const dummy = [
    {
      idx: 0,
      userId: 'J059',
      username: 'mik',
      profileImg: 'https://ca.slack-edge.com/T03V2A4FCLA-U03V9JCAC74-042177e5237c-512',
    },
    {
      idx: 1,
      userId: 'J070',
      username: 'jerry',
      profileImg: 'https://ca.slack-edge.com/T03V2A4FCLA-U04081R1WV7-44a56ecae76d-512',
    },
    {
      idx: 2,
      userId: 'J084',
      username: 'mayo',
      profileImg: 'https://ca.slack-edge.com/T03V2A4FCLA-U03UV1S4G6B-eaf725283352-512',
    },
    {
      idx: 3,
      userId: 'J214',
      username: 'mozak',
      profileImg: 'https://ca.slack-edge.com/T03V2A4FCLA-U0408645KA5-803c24ea468e-512',
    },
  ];
  const [friendsList, setFriendsList] = useState<FriendsList[]>(dummy);
  const plusIcon = './plus.svg';
  return (
    <>
      <S.FriendsBarContainer>
        {friendsList.map((friend) => {
          return <S.ProfileBox key={friend.idx} data-idx={friend.idx} data-id={friend.userId} data-name={friend.username} imgURL={friend.profileImg}></S.ProfileBox>;
        })}
        <S.ProfileBox imgURL={plusIcon}></S.ProfileBox>
      </S.FriendsBarContainer>
    </>
  );
};

export default FriendsBar;