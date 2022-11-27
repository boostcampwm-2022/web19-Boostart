import { useEffect, useState } from 'react';
import { FriendsList } from 'GlobalType';
import { HOST } from '../../constants';
import axios from 'axios';
import * as S from './FriendsBar.style';

const FriendsBar = () => {
  const [friendsList, setFriendsList] = useState<FriendsList[] | null>(null);
  const plusIcon = '/plus.svg';
  const getFriendsList = async () => {
    try {
      setFriendsList(null);
      const response = await axios.get(`${HOST}/api/v1/friend`);
      setFriendsList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFriendsList();
  }, []);

  return (
    <>
      <S.FriendsBarContainer>
        {friendsList &&
          friendsList.map(({ idx, userId, profileImg }) => {
            return <S.ProfileBox key={userId} data-idx={idx} imgURL={profileImg}></S.ProfileBox>;
          })}
        <S.ProfileBox imgURL={plusIcon}></S.ProfileBox>
      </S.FriendsBarContainer>
    </>
  );
};

export default FriendsBar;
