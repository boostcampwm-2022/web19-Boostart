import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { menuState } from '../common/atoms';
import Canvas from './Canvas';
import * as S from './Diary.style';

const Diary = () => {
  const [currentMenu, setCurrentMenu] = useRecoilState(menuState);

  useEffect(() => {
    setCurrentMenu('DIARY');
  }, []);

  return (
    <S.DiaryContainer>
      <S.DiaryNavBarSection></S.DiaryNavBarSection>
      <Canvas />
    </S.DiaryContainer>
  );
};

export default Diary;
