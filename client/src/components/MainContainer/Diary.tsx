import { useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { visitState, menuState } from '../common/atoms';
import Canvas from './Canvas';
import * as S from './Diary.style';
import DateSelector from './DateSelector';

const Diary = () => {
  const currentVisit = useRecoilValue(visitState);
  const [currentMenu, setCurrentMenu] = useRecoilState(menuState);

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
