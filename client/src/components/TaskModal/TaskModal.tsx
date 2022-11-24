import React, { useEffect, useState } from 'react';
import * as S from './TaskModal.style';
import ImportanceInput from './ImportanceInput';
import TagInput from './TagInput';
import useInput from '../../hooks/useInput';
import LocationSearchInput from './LocationSearchInput';
import { Location } from 'GlobalType';
import useCurrentDate from '../../hooks/useCurrentDate';
import { Tag } from 'GlobalType';
 
interface Props {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaskModal = (props: Props) => {
  const [tagObject, setTagObject] = useState<Tag | null>(null);
  const [locationObject, setLocationObject] = useState<Location | null>(null); // { location, lng, lat }

  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { getMonth, getDate } = useCurrentDate();

  const contents = {
    close: '닫기 ▲',
    readMore: '더보기  ▼',
  };

  type ColumnTitle = '제목' | '태그' | '시간' | '라벨' | '중요도' | '공개' | '위치' | '메모';

  const Row = ({ title, content }: { title: ColumnTitle; content: JSX.Element }) => {
    return (
      <tr>
        <td>{title}</td>
        <td>{content}</td>
      </tr>
    );
  };

  return (
    <S.Container>
      <S.ModalContainer isDetailOpen={isDetailOpen}>
        <S.CloseButton onClick={(e) => props.setIsModalOpen(false)} />
        <S.Date>{`• ${getMonth() + 1}.${getDate()} •`}</S.Date>
        <S.TaskForm>
          <S.FormTable>
            <Row title="제목" content={<S.InputBar />} />
            <Row title="태그" content={<TagInput tagObject={tagObject} setTagObject={setTagObject} />} />
            <Row
              title="시간"
              content={
                <>
                  <S.InputTimeBar type="time" />
                  {' ~ '}
                  <S.InputTimeBar type="time" />
                </>
              }
            />
            <Row title="중요도" content={<ImportanceInput />} />
            <Row title="공개" content={<input type="checkbox" />} />
          </S.FormTable>
          <S.DetailButton onClick={() => setIsDetailOpen(!isDetailOpen)}>
            <S.Border>
              <h4>{isDetailOpen ? `${contents.close}` : `${contents.readMore}`}</h4>
            </S.Border>
          </S.DetailButton>
          {isDetailOpen && (
            <S.FormTable>
              <Row title="위치" content={<LocationSearchInput locationObject={locationObject} setLocationObject={setLocationObject} />} />
              <Row title="라벨" content={<></>} />
              <Row title="메모" content={<S.InputArea />} />
            </S.FormTable>
          )}
        </S.TaskForm>
        <S.SubmitButton>NEW TASK!</S.SubmitButton>
      </S.ModalContainer>
    </S.Container>
  );
};

export default TaskModal;
