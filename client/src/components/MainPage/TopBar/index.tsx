import React from 'react';
import Clock from './Clock';
import { MainTitle, TopBarContainer } from './style';

const GNB = () => {
  return (
    <>
      <TopBarContainer>
        <Clock />
        <MainTitle>Boostart</MainTitle>
        <img src="./menu.svg" />
      </TopBarContainer>
    </>
  );
};

export default GNB;
