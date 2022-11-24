import { useEffect, useRef, useState } from 'react';
import Canvas from './Canvas';
import * as S from './Diary.style';
import DateSelector from './DateSelector';

const Diary = () => {
  return (
    <>
      <S.DiaryTitle>Diary</S.DiaryTitle>
      <S.DiaryContainer>
        <S.DiaryNavBarSection>
          <DateSelector />
        </S.DiaryNavBarSection>
        <Canvas />
      </S.DiaryContainer>
    </>
  );
};

export default Diary;