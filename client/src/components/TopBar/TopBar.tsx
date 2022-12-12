import React from 'react';
import Clock from './Clock/Clock';
import * as S from './TopBar.style';

interface TopBarProps {
  handleMenuClick: React.MouseEventHandler;
}
const TopBar = ({ handleMenuClick }: TopBarProps) => {
  return (
    <S.TopBarContainer>
      <S.TopBarElement align="left">
        <Clock />
      </S.TopBarElement>
      <S.TopBarElement align="center">
        <S.MainTitle>Boostart</S.MainTitle>
      </S.TopBarElement>
      <S.TopBarElement align="right">
        <S.MenuIcon src="/menu.svg" onClick={handleMenuClick} />
      </S.TopBarElement>
    </S.TopBarContainer>
  );
};

export default TopBar;
