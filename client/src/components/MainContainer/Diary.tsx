import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { menuState, visitState } from '../common/atoms';
import globalSocket from '../common/Socket';
import Canvas from './Canvas';
import * as S from './Diary.style';
import DateSelector from './DateSelector';
import useCurrentDate from '../../hooks/useCurrentDate';

const Diary = () => {
  const [currentVisit, setCurrentVisit] = useRecoilState(visitState);
  const [currentMenu, setCurrentMenu] = useRecoilState(menuState);

  const { currentDate, dateToString } = useCurrentDate();

  useEffect(() => {
    const currentDateString = dateToString();
    globalSocket.emit('joinToNewRoom', currentVisit.userId, currentDateString);
    return () => {
      globalSocket.emit('leaveCurrentRoom', currentVisit.userId, currentDateString);
    };
  }, [currentVisit, currentDate]);

  useEffect(() => {
    setCurrentMenu('DIARY');
  }, []);

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
