import React, { useEffect, useState } from 'react';
import * as S from './TaskModal.style';
import ImportanceInput from './ImportanceInput';
import TagInput from './TagInput';
import useInput from '../../hooks/useInput';
import LocationSearchInput from './LocationSearchInput';
import { Location, Tag, Label } from 'GlobalType';
import useCurrentDate from '../../hooks/useCurrentDate';
import LabelInput from './LabelInput';
import { FieldValues, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { HOST } from '../../constants';

interface Props {
  handleCloseButtonClick: () => void;
  tagList: Tag[];
  fetchTagList: () => Promise<void>;
}

const formatDate = (date: Date) => {
  const [y, m, d] = date
    .toLocaleDateString()
    .split('.')
    .map((str) => str.trim().padStart(2, '0'));
  return [y.padStart(4, '0'), m.padStart(2, '0'), d.padStart(2, '0')].join('-');
};

const DEFAULT_IMPORTANCE = 3;
const TaskModal = ({ handleCloseButtonClick, tagList, fetchTagList }: Props) => {
  const [tagIdx, setTagIdx] = useState<number | null>(null);
  const [locationObject, setLocationObject] = useState<Location | null>(null); // { location, lng, lat }
  const [labelArray, setLabelArray] = useState<Label[]>([]);

  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { currentDate, getMonth, getDate } = useCurrentDate();

  const [importance, setImportance] = useState(DEFAULT_IMPORTANCE);

  const contents = {
    close: '닫기 ▲',
    readMore: '더보기  ▼',
  };

  const schema = yup.object().shape({
    title: yup.string().required(),
    tagIdx: yup.number().required(),
    startedAt: yup.string().required(),
    endedAt: yup.string().required(),
    importance: yup.number().required(),
    isPublic: yup.bool(),
    location: yup.string(),
    lat: yup
      .number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable(),
    lng: yup
      .number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable(),
    content: yup.string(),
  });
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { replace } = useFieldArray({
    control,
    name: 'labels',
  });

  type ColumnTitle = '제목' | '태그' | '시간' | '라벨' | '중요도' | '공개' | '위치' | '메모';

  const Row = ({ title, content }: { title: ColumnTitle; content: JSX.Element }) => {
    return (
      <tr>
        <td>{title}</td>
        <td>{content}</td>
      </tr>
    );
  };

  const createTask = async (body: FieldValues) => {
    await httpPostTask({ ...body, date: formatDate(currentDate) });
    handleCloseButtonClick();
  };

  const httpPostTask = async (body: FieldValues) => {
    await axios.post(`${HOST}/api/v1/task`, body);
  };

  // k-th star clicked
  const handleStarClick = (k: number) => () => {
    setImportance(k);
  };

  const setValues = () => {
    if (locationObject) {
      const { lat, lng, location } = locationObject;
      setValue('lat', lat);
      setValue('lng', lng);
      setValue('location', location);
    }

    setValue('importance', importance);

    if (tagIdx) {
      setValue('tagIdx', tagIdx);
    }

    replace(
      labelArray.map(({ idx: labelIdx, amount }) => {
        return { labelIdx, amount };
      })
    );
  };

  const [isTagInputFocused, setIsTagInputFocused] = useState(false);
  return (
    <S.ModalContainer isDetailOpen={isDetailOpen}>
      <S.CloseButton onClick={handleCloseButtonClick} />
      <S.Date>{`• ${getMonth() + 1}.${getDate()} •`}</S.Date>
      <S.TaskForm onSubmit={handleSubmit(createTask)}>
        <S.FormTable>
          <tbody>
            <Row title="제목" content={<S.InputBar {...register('title')} />} />
            <input type="number" {...register('tagIdx')} hidden={true} />
            <Row title="태그" content={<TagInput tagIdx={tagIdx} setTagIdx={setTagIdx} tagList={tagList} fetchTagList={fetchTagList} isTagInputFocused={isTagInputFocused} setIsTagInputFocused={setIsTagInputFocused} />} />
            <Row
              title="시간"
              content={
                <>
                  <S.InputTimeBar type="time" {...register('startedAt')} />
                  {' ~ '}
                  <S.InputTimeBar type="time" {...register('endedAt')} />
                </>
              }
            />
            <input type="number" {...register('importance')} hidden={true} />
            <Row title="중요도" content={<ImportanceInput importance={importance} handleStarClick={handleStarClick} />} />
            <Row title="공개" content={<input type="checkbox" {...register('isPublic')} />} />
          </tbody>
        </S.FormTable>
        <S.DetailButton onClick={() => setIsDetailOpen(!isDetailOpen)}>
          <S.Border>
            <h4>{isDetailOpen ? `${contents.close}` : `${contents.readMore}`}</h4>
          </S.Border>
        </S.DetailButton>
        <input {...register('labels')} hidden={true} />
        {isDetailOpen && (
          <S.FormTable>
            <tbody>
              <input {...register('lat')} hidden={true} />
              <input {...register('lng')} hidden={true} />
              <input {...register('location')} hidden={true} />
              <Row title="위치" content={<LocationSearchInput locationObject={locationObject} setLocationObject={setLocationObject} />} />
              <S.LagreTr>
                <td>라벨</td>
                <td>{<LabelInput labelArray={labelArray} setLabelArray={setLabelArray} />}</td>
              </S.LagreTr>
              <Row title="메모" content={<S.InputArea {...register('content')} />} />
            </tbody>
          </S.FormTable>
        )}
        <S.SubmitButton onClick={setValues}>NEW TASK!</S.SubmitButton>
      </S.TaskForm>
    </S.ModalContainer>
  );
};

export default TaskModal;
