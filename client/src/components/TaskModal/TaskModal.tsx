import React, { useEffect, useState } from 'react';
import * as S from './TaskModal.style';
import ImportanceInput from './ImportanceInput';
import TagInput from './TagInput';
import useInput from '../../hooks/useInput';
import LocationInput from './LocationInput';
import { Location } from 'GlobalType';

interface Props {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const TaskModal = (props: Props) => {
  const [tagidx, setTagIdx] = useState<number | null>(null);
  const [locationObject, setLocationObject] = useState<Location | null>(null); // { location, lng, lat }

  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <S.Container>
      <S.ModalContainer isDetailOpen={isDetailOpen}>
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
          <S.DetailButton onClick={() => setIsDetailOpen(!isDetailOpen)}>
            <S.Border>
              <h4>{isDetailOpen ? '닫기 ▲' : '더보기  ▼'}</h4>
            </S.Border>
          </S.DetailButton>
          {isDetailOpen && (
            <S.FormTable>
              <tbody>
                <tr>
                  <td>위치</td>
                  <td>
                    <LocationInput locationObject={locationObject} setLocationObject={setLocationObject} />
                  </td>
                </tr>
                <tr>
                  <td>라벨</td>
                  <td></td>
                </tr>
                <tr>
                  <td>메모</td>
                  <td>
                    <S.InputArea />
                  </td>
                </tr>
              </tbody>
            </S.FormTable>
          )}
        </S.TaskForm>
        <S.SubmitButton>NEW TASK!</S.SubmitButton>
      </S.ModalContainer>
    </S.Container>
  );
};

export default TaskModal;
