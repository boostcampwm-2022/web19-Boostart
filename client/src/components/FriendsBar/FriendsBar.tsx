import { useState } from 'react';
import { Friend } from 'GlobalType';
import { dummyFriendList } from '../common/dummy';
import * as S from './FriendsBar.style';

interface FriendBarProps {
  handlePlusButtonClick: React.MouseEventHandler;
}

const FriendsBar = ({ handlePlusButtonClick }: FriendBarProps) => {
  const [friendsList, setFriendsList] = useState<Friend[]>(dummyFriendList);
  const plusIcon = './plus.svg';
  return (
    <>
      <S.FriendsBarContainer>
        {friendsList.map(({ idx, user_id, profile_img }) => {
          return <S.ProfileBox key={user_id} data-idx={idx} imgURL={profile_img}></S.ProfileBox>;
        })}
        <S.ProfileBox imgURL={plusIcon} onClick={handlePlusButtonClick}></S.ProfileBox>
      </S.FriendsBarContainer>
    </>
  );
};

export default FriendsBar;
