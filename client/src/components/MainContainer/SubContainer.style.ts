import styled from 'styled-components';

export const Content = styled.div`
  width: 100%;
  height: 36rem;
  background: white;
  border-radius: 1rem;
  margin-top: 0rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  position: relative;
  box-shadow: 0px 0px 10px 5px rgba(175, 175, 175, 0.25);
  user-select: none;
`;

export const Title = styled.span`
  display: inline-block;
  color: white;
  font-size: 1.7rem;
  font-family: 'Press Start 2P', cursive;
  transform: translate(1.75rem, 0.43rem);
  z-index: 1;
`;

export const NavBarSection = styled.div`
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
