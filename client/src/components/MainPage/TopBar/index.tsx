import React from 'react';
import Clock from './Clock';
import * as S from './style';

const GNB = () => {
  return (
    <>
      <S.TopBarContainer>
        <Clock />
        <S.MainTitle>Boostart</S.MainTitle>
        <img src="./menu.svg" />
      </S.TopBarContainer>
    </>
  );
};

export default GNB;
