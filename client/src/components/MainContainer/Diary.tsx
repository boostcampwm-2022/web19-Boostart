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
  const { currentDate, dateToString } = useCurrentDate();

  useEffect(() => {
    const currentDateString = dateToString();
    globalSocket.emit('joinToNewRoom', currentVisit.userId, currentDateString);
    return () => {
      globalSocket.emit('leaveCurrentRoom', currentVisit.userId, currentDateString);
    };
  }, [currentVisit, currentDate]);
  return (
    <>
      <S.DiaryTitle>
        DIARY <span> {currentVisit.isMe || `~${currentVisit.userId}`}</span>
      </S.DiaryTitle>
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
