import React from 'react';
import axios from 'axios';
import { HOST } from '../../constants';
import styled from 'styled-components';
import useInput from '../../hooks/useInput';

axios.defaults.withCredentials = true; // withCredentials 전역 설정

interface FriendSearchInputProps {
  setFriendObject: React.Dispatch<React.SetStateAction<Friend[] | null>>;
}

const FriendSearchInput = ({ setFriendObject }: FriendSearchInputProps) => {
  const [friendInput, onChangeFriendInput, setFriendInput] = useInput('');

  const getFriendList = async () => {
    try {
      const result = await axios.get(`${HOST}/api/v1/user?user_id=${friendInput}`);
      const list = result.data.sort();
      setFriendObject(list);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FriendInputcontainer>
      <span>친구 ID</span>
      <InputBar value={friendInput} onChange={onChangeFriendInput} />
      <SearchSvg src="/search.svg" onClick={getFriendList} />
    </FriendInputcontainer>
  );
};

export default FriendSearchInput;

const FriendInputcontainer = styled.div`
  display: flex;
  padding: 0 0.5rem;
  justify-content: space-around;
  align-items: center;
  font-family: 'Noto Sans KR', sans-serif;
  z-index: 1002;
`;

const InputBar = styled.input`
  margin: auto;
  background: var(--color-gray0);
  border: 1px solid var(--color-gray3);
  border-radius: 8px;
  color: black;
  width: 14.8rem;
  height: 2rem;
  font-size: 0.8rem;
  padding-left: 1rem;
`;

const SearchSvg = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;
