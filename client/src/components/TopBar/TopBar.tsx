import React from 'react';
import Clock from './Clock/Clock';
import * as S from './TopBar.style';

interface TopBarProps {
  handleMenuClick: React.MouseEventHandler;
}
const TopBar = ({ handleMenuClick }: TopBarProps) => {
  return (
    <>
      <S.TopBarContainer>
        <Clock />
        <S.MainTitle>Boostart</S.MainTitle>
        <S.MenuIcon src="/menu.svg" onClick={handleMenuClick} />
      </S.TopBarContainer>
    </>
  );
};

export default TopBar;
