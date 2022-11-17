import React from 'react';
import * as S from './style';
import PriorityMenu from './PriorityMenu';
interface Props {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const TaskModal = (props: Props) => {
  return (
    <S.Container>
      <S.CalendarContainer>
        {' '}
        <S.CloseButton onClick={(e) => props.setIsModalOpen(false)} />
        <S.Date>{'• 11.12 •'}</S.Date>
        <S.TaskForm>
          <S.FormTable>
            <tbody>
              <tr>
                <td>제목</td>
                <td>
                  <S.InputBar />
                </td>
              </tr>
              <tr>
                <td>태그</td>
                <td>
                  <S.InputBar />
                </td>
              </tr>
              <tr>
                <td>시간</td>
                <td>
                  <S.InputTimeBar type="time" />
                  {' ~ '}
                  <S.InputTimeBar type="time" />
                </td>
              </tr>
              <tr>
                <td>중요도</td>
                <td>
                  <PriorityMenu />
                </td>
              </tr>
              <tr>
                <td>공개</td>
                <td>
                  <input type="checkbox"></input>
                </td>
              </tr>
            </tbody>
          </S.FormTable>
        </S.TaskForm>
        <S.Border>
          <h4>{'더보기  ▼'}</h4>
        </S.Border>
      </S.CalendarContainer>
    </S.Container>
  );
};

export default TaskModal;
