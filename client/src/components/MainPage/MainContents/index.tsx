import React from 'react';
import Calendar from './Calendar';
import * as S from './style';

const MainContents = () => {
  return (
    <>
      <S.MainContentContainer>
        <S.LeftSection>
          <Calendar></Calendar>
        </S.LeftSection>
        <S.RightSection></S.RightSection>
      </S.MainContentContainer>
    </>
  );
};

export default MainContents;
