import React, { useState } from 'react';
import TaskModal from '../TaskModal';
import Calendar from './Calendar';
import Log from './Log';
import * as S from './style';

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
          <Log></Log>
          <S.NewTaskButton onClick={(e) => setIsModalOpen(true)}>+</S.NewTaskButton>
        </S.RightSection>
      </S.MainContentContainer>
    </S.Container>
  );
};

export default MainContents;
