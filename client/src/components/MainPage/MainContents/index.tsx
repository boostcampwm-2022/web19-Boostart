import React from 'react';
import Calendar from './Calendar';
import Log from './Log';
import * as S from './style';

const MainContents = () => {
  return (
    <S.Container>
      <S.MainContentContainer>
        <S.LeftSection>
          <Calendar></Calendar>
        </S.LeftSection>
        <S.RightSection>
          <Log></Log>
        </S.RightSection>
      </S.MainContentContainer>
    </S.Container>
  );
};

export default MainContents;
