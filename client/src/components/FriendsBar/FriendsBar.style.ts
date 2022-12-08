import styled from 'styled-components';
import { HOST } from '../../constants';

export const FriendsBarContainer = styled.div`
  width: 70.5rem;
  height: 3rem;
  background: white;
  border-radius: 0.8rem;
  margin: 0 auto;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  transform: translateY(-0.35rem);
  box-shadow: 0px 0px 10px 5px rgba(175, 175, 175, 0.25);
`;

export const ProfileBox = styled.div<{
  userId: string;
  imgURL: string;
  nowVisiting?: boolean;
}>`
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 3.4rem;
  border: ${(props) => (props.nowVisiting ? '5px solid #bccdec' : '1px solid #d4d4d4')};
  margin: 0 0.4rem;
  box-sizing: border-box;
  background: url(${(props) => (props.imgURL === '/plus.svg' ? props.imgURL : HOST + '/' + props.imgURL)}) no-repeat center center / ${(props) => (props.imgURL === '/plus.svg' ? '1.25rem 2.8rem' : '3.5rem 3.5rem')};
  &:hover {
    border: 5px solid #bccdec;
  }
  &:hover::after {
    content: '${(props) => props.userId}';
    background: rgba(255, 255, 255, 0.6);
    padding: 0.375rem;
    border: 1px solid var(--color-gray3);
    border-radius: 0.5rem;
    display: block;
    font-size: 0.875rem;
    line-height: 0.7rem;
    position: absolute;
    transform: translate(1.5rem, -1.75rem);
    z-index: 801;
  }
`;

export const FriendMenuModal = styled.div`
  height: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  background-color: #eef3fd;
  border: #7689fd solid 1px;
  border-radius: 5px;
  margin-top: 6.8px;
  padding: 5px 11px;
  position: absolute;
  width: fit-content;
  z-index: 800;
  &::after {
    content: '';
    width: 0;
    display: block;
    position: absolute;
    border-color: #eef3fd transparent;
    border-style: solid;
    border-width: 0 6px 8px 6.5px;
    top: -7px;
    left: 1.375rem;
    z-index: 1;
  }
  &::before {
    border-color: #7689fd transparent;
    border-style: solid;
    border-width: 0 6px 8px 6.5px;
    content: '';
    display: block;
    left: 1.375rem;
    position: absolute;
    top: -8px;
    width: 0;
    z-index: 0;
  }
`;

export const FriendMenuModalItem = styled.div`
  color: var(--color-main);
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    font-weight: 700;
    color: #505bf0;
  }
`;

export const FriendProfileContainer=styled.div`
width: 31rem;
height: 13rem;
border-radius: 1rem;
background: white;
display: flex;
justify-content:center;
align-items: center;
`
export const FriendProfileInfo = styled.div`
width: 15rem;
display: flex;
flex-direction: column;
justify-content: center;
gap: 0.75rem;
`
export const FriendProfileName = styled.span`
  font-size: 1.5rem;
  font-family: 'Noto Sans KR', sans-serif;
`

export const FriendProfileId = styled.span`
margin-bottom: 2rem;
  color: #707070;
  font-size: 1rem;
  font-family: 'Noto Sans KR', sans-serif;
`