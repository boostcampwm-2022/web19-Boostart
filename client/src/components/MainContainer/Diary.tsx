import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { visitState } from '../common/atoms';
import globalSocket from '../common/Socket';
import Canvas from './Canvas';
import * as S from './Diary.style';
import DateSelector from './DateSelector';
import useCurrentDate from '../../hooks/useCurrentDate';

const Diary = () => {
  const currentVisit = useRecoilValue(visitState);
  const { currentDate, getYear, getMonth, getDate } = useCurrentDate();
  const createDateString = () => {
    return `${getYear()}${(getMonth() + 1).toString().padStart(2, '0')}${getDate().toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const currentDateString = createDateString();
    globalSocket.emit('joinToNewRoom', currentVisit, currentDateString);
    globalSocket.emit('requestCurrentObjects');
    return () => {
      globalSocket.emit('leaveCurrentRoom', currentVisit, currentDateString);
    };
  }, [currentVisit, currentDate]);
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
