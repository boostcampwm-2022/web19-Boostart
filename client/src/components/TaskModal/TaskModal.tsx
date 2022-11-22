import React, { useEffect, useState } from 'react';
import * as S from './TaskModal.style';
import ImportanceInput from './ImportanceInput';
import TagInput from './TagInput';
import useInput from '../../hooks/useInput';

interface Props {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const TaskModal = (props: Props) => {
  const [tagidx, setTagIdx] = useState<number | null>(null);

  useEffect(() => console.log(tagidx), [tagidx]); // 선택된 tag idx로 변경되는지 test 확인 용 코드

  return (
    <S.Container>
      <S.ModalContainer>
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
                  <TagInput setTagIdx={setTagIdx} />
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
                  <ImportanceInput />
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
      </S.ModalContainer>
    </S.Container>
  );
};

export default TaskModal;
