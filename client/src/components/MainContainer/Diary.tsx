import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { visitState } from '../common/atoms';
import globalSocket from '../common/Socket';
import Canvas from './Canvas';
import * as S from './Diary.style';
import DateSelector from './DateSelector';
import useCurrentDate from '../../hooks/useCurrentDate';

const Diary = () => {
  const currentVisit = useRecoilValue(visitState);
  const { currentDate, DateToString } = useCurrentDate();

  useEffect(() => {
    const currentDateString = DateToString();
    console.log(currentDateString);
    globalSocket.emit('joinToNewRoom', currentVisit, currentDateString);
    globalSocket.emit('requestCurrentObjects');
    return () => {
      globalSocket.emit('leaveCurrentRoom', currentVisit, currentDateString);
    };
  }, [currentVisit, currentDate]);
  return (
    <>
      <S.DiaryTitle>DIARY</S.DiaryTitle>
      <S.Container>
        <S.DiaryContainer>
          <S.DiaryNavBarSection>
            <DateSelector />
          </S.DiaryNavBarSection>
          <Canvas />
        </S.DiaryContainer>
      </S.Container>
    </>
  );
};

export default Diary;
