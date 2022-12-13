import { Route, Routes } from 'react-router-dom';
import Calendar from './Calendar';
import Diary from './Diary';
import GoalManager from './GoalManager';
import Log from './Log';
import * as S from './MainContainer.style';
import SubContainer from './SubContainer';
import Map from './Map';

const MainContents = () => {
  return (
    <S.Container>
      <S.MainContentContainer>
        <S.LeftSection>
          <Calendar />
        </S.LeftSection>
        <S.RightSection>
          <Routes>
            <Route path="log/" element={<Log />} />
            <Route path="diary/" element={<SubContainer title="DIARY" element={<Diary />} />} />
            <Route path="goal" element={<SubContainer title="GOAL" element={<GoalManager />} />} />
            <Route path="map/" element={<SubContainer title="MAP" element={<Map />} />} />
          </Routes>
        </S.RightSection>
      </S.MainContentContainer>
    </S.Container>
  );
};

export default MainContents;
