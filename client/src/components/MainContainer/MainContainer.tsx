import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Modal from '../common/Modal';
import TaskModal from '../TaskModal/TaskModal';
import Calendar from './Calendar';
import Diary from './Diary';
import GoalManager from './GoalManager';
import Log from './Log';
import * as S from './MainContainer.style';
import SubContainer from './SubContainer';

const MainContents = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <S.Container>
      {isModalOpen && <Modal component={<TaskModal setIsModalOpen={setIsModalOpen} />} zIndex={1001} top={'50%'} left={'50%'} transform={'translate(-50%, -50%)'} handleDimmedClick={() => {}} />}
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
            <Route path="goal" element={<SubContainer title="GOAL" element={<GoalManager />} />} />
          </Routes>
        </S.RightSection>
      </S.MainContentContainer>
    </S.Container>
  );
};

export default MainContents;
