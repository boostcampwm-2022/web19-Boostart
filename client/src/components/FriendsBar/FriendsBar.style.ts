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
`;
