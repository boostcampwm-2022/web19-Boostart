import { useState } from 'react';
import styled from 'styled-components';
import { HOST } from '../../constants';
import FriendSearchInput from './FriendSearchInput';

interface FriendSearchFormProps {
  selectedFriend: number | null;
  setSelectedFriend: React.Dispatch<React.SetStateAction<number | null>>;
  handleRequestButtonClick: React.MouseEventHandler;
}

interface FriendSearchResultProps {
  idx: number;
  userId: string;
  username: string;
  profileImg: string;
  selectedFriend: number | null;
  setSelectedFriend: React.Dispatch<React.SetStateAction<number | null>>;
}

const FriendSearchForm = ({ selectedFriend, setSelectedFriend, handleRequestButtonClick }: FriendSearchFormProps) => {
  const [friendObject, setFriendObject] = useState<Friend[] | null>(null);
  return (
    <>
      <FriendSearchContainer>
        <FriendSearchTitle>새로운 친구 추가</FriendSearchTitle>
        <FriendSearchInput setFriendObject={setFriendObject} />
        <FriendResultList>
          {friendObject &&
            friendObject.map(({ idx, userId, username, profileImg }) => {
              return <FriendSearchResult key={idx} idx={idx} userId={userId} username={username} profileImg={profileImg} selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend} />;
            })}
        </FriendResultList>
        <FriendRequestButton isSelectedFriendNull={selectedFriend === null} onClick={handleRequestButtonClick}>
          Friend Request!
        </FriendRequestButton>
      </FriendSearchContainer>
    </>
  );
};

export default FriendSearchForm;

const FriendSearchResult = ({ idx, userId, username, profileImg, selectedFriend, setSelectedFriend }: FriendSearchResultProps) => {
  const handleFriendClick = () => {
    setSelectedFriend(idx);
  };
  return (
    <FriendResult isSelected={idx === selectedFriend} onClick={handleFriendClick}>
      <FriendProfile imgURL={HOST + '/' + profileImg}></FriendProfile>
      <FriendInfo>
        <span>
          <strong>{username}</strong>님
        </span>
        <span>@{userId}</span>
      </FriendInfo>
    </FriendResult>
  );
};

export const FRIEND_SEARCH_MODAL_ZINDEX = 1001;
const FriendSearchContainer = styled.div`
  width: 31rem;
  height: 35rem;
  position: relative;
  padding: 2rem 4rem;
  background: white;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
`;
const FriendSearchTitle = styled.span`
  color: var(--color-main);
  font-family: 'Press Start 2P';
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -3px;
  text-align: center;
`;

const FriendResultList = styled.div`
  height: 21rem;
  overflow-y: scroll;
`;
const FriendResult = styled.div<{
  isSelected: boolean;
}>`
  width: 21rem;
  height: 6.5rem;
  margin: 0 0 1rem;
  padding: ${({ isSelected }) => (isSelected ? '1rem 1rem 1rem 0.5rem' : '1rem')};
  border: ${({ isSelected }) => (isSelected ? '0.5rem solid var(--color-main)' : 'none')};
  display: flex;
  align-items: center;
  border-radius: 1rem;
  background: #f8f8f8;
  box-sizing: border-box;
  cursor: pointer;
`;

const FriendProfile = styled.div<{
  imgURL: string;
}>`
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 9rem;
  margin-right: 1rem;
  background: url(${(props) => props.imgURL}) no-repeat center center / 4.5rem 4.5rem;
  box-sizing: border-box;
`;

const FriendInfo = styled.div`
  height: 4.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FriendRequestButton = styled.button<{ isSelectedFriendNull: boolean }>`
  width: 18.5rem;
  height: 2rem;
  border: none;
  border-radius: 1rem;
  margin: 0 auto;
  background: ${(props) => (props.isSelectedFriendNull ? 'var(--color-gray3)' : 'var(--color-main)')};
  color: white;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.875rem;
  text-align: center;
  cursor: pointer;
`;
