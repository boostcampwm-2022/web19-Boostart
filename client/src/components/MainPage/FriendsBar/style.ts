import styled from 'styled-components';

export const FriendsBarContainer = styled.div`
  width: 90rem;
  height: 3.4rem;
  background: white;
  border-radius: 0.5rem;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
`;

export const ProfileBox = styled.div<{
  imgURL: string;
}>`
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 3.4rem;
  border: 1px solid #d4d4d4;
  margin: 0 0.5rem;
  box-sizing: border-box;
  background: url(${(props) => props.imgURL}) no-repeat center center / ${(props) => (props.imgURL === './plus.svg' ? '1.25rem 2.8rem' : '3.5rem 3.5rem')};
  &:hover {
    border: 5px solid #bccdec;
  }
`;
