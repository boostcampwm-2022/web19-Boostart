import styled from 'styled-components';

export const TopBarContainer = styled.div`
  width: 69rem;
  height: 5.5rem;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
`;

export const TopBarElement = styled.div<{ align: string }>`
  width: 20rem;
  display: flex;
  justify-content: ${(props) => props.align};
`;

export const MainTitle = styled.div`
  color: white;
  font-size: 5.5rem;
  font-family: 'Baumans', cursive;
  z-index: 501;
`;

export const MenuIcon = styled.img`
  align-self: center;
  cursor: pointer;
`;
