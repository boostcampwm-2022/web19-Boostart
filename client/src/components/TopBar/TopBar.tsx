import React from 'react';
import Clock from './Clock/Clock';
import * as S from './TopBar.style';

const TopBar = () => {
  return (
    <>
      <S.TopBarContainer>
        <Clock />
        <S.MainTitle>Boostart</S.MainTitle>
        <S.MenuIcon src="./menu.svg" />
      </S.TopBarContainer>
    </>
  );
};

export default TopBar;
