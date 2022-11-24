import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import TaskModal from '../TaskModal/TaskModal';
import Calendar from './Calendar';
import Diary from './Diary';
import Log from './Log';
import * as S from './MainContainer.style';

const MainContents = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <S.Container>
      {isModalOpen ? <TaskModal setIsModalOpen={setIsModalOpen} /> : null}
      <S.MainContentContainer>
        <S.LeftSection>
          <Calendar></Calendar>
        </S.LeftSection>
        <S.RightSection>
          <Routes>
            <Route
              path="log/"
              element={
                <>
                  <Log />
                  <S.NewTaskButton onClick={() => setIsModalOpen(true)}>+</S.NewTaskButton>
                </>
              }
            />
            <Route path="diary/" element={<Diary />} />
          </Routes>
        </S.RightSection>
      </S.MainContentContainer>
    </S.Container>
  );
};

export default MainContents;
