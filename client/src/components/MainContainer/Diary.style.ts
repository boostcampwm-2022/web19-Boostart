import styled from 'styled-components';

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
