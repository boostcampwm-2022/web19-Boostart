import styled from 'styled-components';

export const DiaryTitle = styled.span`
  display: inline-block;
  color: white;
  font-size: 1.7rem;
  font-family: 'Press Start 2P', cursive;
  transform: translate(1.75rem, 0.43rem);
  z-index: 1;
  span {
    font-size: 1.2rem;
  }
`;

export const Container = styled.div`
  height: 36rem;
  background: white;
  border-radius: 1rem;
  margin-top: 0rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  box-shadow: 0px 0px 10px 5px rgba(175, 175, 175, 0.25);
`;

export const DiaryContainer = styled.div`
  position: relative;
  user-select: none;
  width: 100;
  height: 100;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  //justify-content: center;
`;

export const DiaryNavBarSection = styled.div`
  width: 100%;
  height: 3rem;
  padding-bottom: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  grid-area: nav;
  box-sizing: border-box;
  cursor: default;
`;

export const DateController = styled.span`
  color: #99b1db;
  font-size: 1.5rem;
  font-family: 'Press Start 2P', cursive;
  cursor: default;
`;
