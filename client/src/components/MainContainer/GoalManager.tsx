import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import { LabelList } from '../TaskModal/LabelInput';
import * as S from './GoalManager.style';
import { NewTaskButton } from './Log.style';
import { Label } from 'GlobalType';
import axios from 'axios';
import { HOST } from '../../constants';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useCurrentDate from '../../hooks/useCurrentDate';
import { visitState, menuState } from '../common/atoms';
import { useRecoilValue, useRecoilState } from 'recoil';

const labelMap = new Map<number, Label>();

const httpGetGoalList = async (userId: string, dateString: string) => {
  const response = await axios.get(`${HOST}/api/v1/goal/${userId}?date=${dateString}`);
  const goalList = response.data;
  return goalList;
};

const httpPostGoal = async (body: FieldValues) => {
  const response = await axios.post(`${HOST}/api/v1/goal`, body);
  return response;
};

const httpGetLabelList = async (userId: string = '') => {
  // TODO: 전역 상태로 분리 고려
  const response = await axios.get(`${HOST}/api/v1/label/${userId}`);
  const labelList = response.data;
  return labelList;
};

const httpDeleteLabel = async (idx: number) => {
  const response = await axios.delete(`${HOST}/api/v1/label/${idx}`);
  return response;
};

const httpPatchLabel = async (idx: number, { title, color }: { title?: string; color?: string }) => {
  const response = await axios.patch(`${HOST}/api/v1/label/${idx}`, { title, color });
  return response;
};

const generateRandomHexColor = () => {
  const R = Math.floor(Math.random() * 127 + 128).toString(16);
  const G = Math.floor(Math.random() * 127 + 128).toString(16);
  const B = Math.floor(Math.random() * 127 + 128).toString(16);
  return `#${[R, G, B].join('')}`;
};

const GoalManager = () => {
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const { currentDate, dateToString } = useCurrentDate();
  const [goalList, setGoalList] = useState<Goal[]>([]);
  const currentVisit = useRecoilValue(visitState);

  const [currentMenu, setCurrentMenu] = useRecoilState(menuState);

  const fetchLabelMap = async () => {
    try {
      const labelList = await httpGetLabelList(currentVisit.userId);
      labelList.forEach((label: Label) => {
        labelMap.set(label.idx, label);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGoalList = async () => {
    try {
      httpGetGoalList(currentVisit.userId, dateToString()).then(setGoalList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLabelMap().then(() => {
      fetchGoalList();
    });
  }, [currentVisit]);

  useEffect(() => {
    fetchGoalList();
  }, [currentDate]);

  const handleNewGoalButtonClick = () => {
    setIsGoalModalOpen(true);
  };

  const handleCloseButtonClick = () => {
    fetchLabelMap().then(fetchGoalList);
    setIsGoalModalOpen(false);
  };

  useEffect(() => {
    setCurrentMenu('GOAL');
  }, []);

  return (
    <>
      <S.GoalHead>
        <span>목표</span> <span>제목</span> <span>현황</span> <span>달성률</span>
      </S.GoalHead>
      <S.GoalList>
        {goalList.map((goal) => (
          <Goal key={goal.idx} goal={goal} />
        ))}
      </S.GoalList>
      {currentVisit.isMe && <NewTaskButton onClick={handleNewGoalButtonClick} />}
      {isGoalModalOpen && (
        <Modal
          component={<GoalModal isLabelModalOpen={isLabelModalOpen} setIsLabelModalOpen={setIsLabelModalOpen} handleCloseButtonClick={handleCloseButtonClick} />}
          zIndex={GOAL_MODAL_Z_INDEX}
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          handleDimmedClick={() => {
            isLabelModalOpen ? setIsLabelModalOpen(false) : handleCloseButtonClick();
          }}
        />
      )}
    </>
  );
};

const GOAL_MODAL_Z_INDEX = 1000;

interface GoalModalProps {
  isLabelModalOpen: boolean;
  setIsLabelModalOpen: React.Dispatch<boolean>;
  handleCloseButtonClick: () => void;
}

const GoalModal = ({ isLabelModalOpen, setIsLabelModalOpen, handleCloseButtonClick }: GoalModalProps) => {
  const [selectedLabelIndex, setSelectedLabelIndex] = useState<number>();
  const [labelList, setLabelList] = useState<Label[]>([]);
  const [over, setOver] = useState(true);
  const { dateToString } = useCurrentDate();

  const schema = yup.object().shape({
    title: yup.string().required(),
    date: yup.string().required(),
    labelIdx: yup.number().required(),
    amount: yup.number().required(),
    over: yup.boolean().required(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const setValues = () => {
    setValue('date', dateToString());
    if (typeof selectedLabelIndex === 'number') setValue('labelIdx', selectedLabelIndex);
    if (over !== undefined) setValue('over', over);
  };

  useEffect(() => {
    try {
      httpGetLabelList().then(setLabelList);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleLabelClick = (label: Label) => {
    setSelectedLabelIndex(label.idx);
    setColor(label.color);
  };

  const handleLabelAddButtonClick = () => {
    setIsLabelModalOpen(true);
  };

  const handleOverInputClick = () => {
    setOver(!over);
  };

  const handleDeleteButtonClick = async (e: React.MouseEvent, label: Label) => {
    e.stopPropagation();
    if (!window.confirm('라벨을 삭제하시겠습니까?')) return;
    try {
      await httpDeleteLabel(label.idx);
      httpGetLabelList().then(setLabelList);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { msg } = error.response?.data;
        alert(msg);
      } else {
        console.log(error);
      }
    }
  };

  const goalSubmit = async (goalData: FieldValues) => {
    try {
      const response = await httpPostGoal(goalData);
      handleCloseButtonClick();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { msg } = error.response?.data;
        alert(msg);
      } else {
        console.log(error);
      }
    }
  };

  const label = labelList.find((label) => label.idx === selectedLabelIndex);

  const [color, setColor] = useState(label?.color);

  const handleColorInputChange = (e: React.ChangeEvent) => {
    const color = (e.target as HTMLInputElement).value;
    setColor(color);
  };

  const handleColorInputBlur = async () => {
    if (!selectedLabelIndex) return;
    if (!color) return;
    try {
      httpPatchLabel(selectedLabelIndex, { color });
      const label = labelList.find((label) => label.idx === selectedLabelIndex);
      if (!label) return;
      label.color = color;
      setLabelList([...labelList]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <S.GoalModal onSubmit={handleSubmit(goalSubmit)}>
        <S.GoalModalLabelTitleInput placeholder="제목을 설정하세요" {...register('title')} />
        <S.GoalModalLabel color={label ? color : 'white'}>
          <S.LabelModalLabelColorInput value={color ?? '#ffffff'} type="color" {...register('color')} onChange={handleColorInputChange} onBlur={handleColorInputBlur} />
          <S.GoalModalLabelName value={label ? label.title : ''} placeholder="라벨을 설정하세요" filled={!!label} disabled={true} />
          <S.GoalModalAmountInput type="number" min="0" disabled={selectedLabelIndex === undefined} placeholder="목표량" {...register('amount')} />
          <div>{label ? label.unit : ''}</div>
          <S.GoalModalOverInput onClick={handleOverInputClick}>{over ? '▲' : '▼'}</S.GoalModalOverInput>
        </S.GoalModalLabel>
        <S.LabelListContainer>
          <LabelList labelList={labelList} handlePlusButtonClick={handleLabelAddButtonClick} handleItemClick={handleLabelClick} handleDeleteButtonClick={handleDeleteButtonClick} />
        </S.LabelListContainer>
        <S.GoalModalSubmitButton onClick={setValues}>NEW GOAL!</S.GoalModalSubmitButton>
      </S.GoalModal>
      {isLabelModalOpen && (
        <Modal
          component={
            <LabelModal
              handleCloseButtonClick={() => {
                try {
                  httpGetLabelList().then(setLabelList);
                  setIsLabelModalOpen(false);
                } catch (error) {
                  console.log(error);
                }
              }}
            />
          }
          zIndex={LABEL_MODAL_Z_INDEX}
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          handleDimmedClick={() => {
            setIsLabelModalOpen(false);
          }}
          dimmedBorderRadius={S.GOAL_MODAL_BORDER_RADIUS}
        />
      )}
    </>
  );
};

const LABEL_MODAL_Z_INDEX = 1002;

interface LabelModalProps {
  handleCloseButtonClick: () => void;
}

const LabelModal = ({ handleCloseButtonClick }: LabelModalProps) => {
  const schema = yup.object().shape({
    title: yup.string().required(),
    unit: yup.string().required(),
    color: yup.string().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [color, setColor] = useState(generateRandomHexColor());

  const handleLabelColorChange = (e: React.ChangeEvent) => {
    // TODO: Throttle 고려
    const color = (e.target as HTMLInputElement).value;
    setColor(color);
  };

  const labelSubmit = async (labelData: FieldValues) => {
    try {
      await axios.post(`${HOST}/api/v1/label`, labelData);
      handleCloseButtonClick();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { msg } = error.response?.data;
        alert(msg);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <S.LabelModal onSubmit={handleSubmit(labelSubmit)}>
      <S.LabelModalLabel color={color}>
        <S.LabelModalLabelTitleInput placeholder="라벨 이름" {...register('title')} />
        <S.VertialRule />
        <S.LabelModalLabelUnitInput placeholder="단위" {...register('unit')} />
        <S.VertialRule />
        <S.LabelModalLabelColorInput value={color} type="color" {...register('color')} onChange={handleLabelColorChange} />
      </S.LabelModalLabel>
      <S.LabelModalLabelCreateButton>ADD LABEL!</S.LabelModalLabelCreateButton>
    </S.LabelModal>
  );
};

interface WaveProps {
  textContent: string;
  percentage: number;
}

const PRIMARY_COLOR = '#9BB1D7';
const WaveContainer = ({ textContent, percentage }: WaveProps) => {
  const BOUNDARY = 0.3;
  return (
    <S.WaveContainer>
      <S.Wrap color={percentage <= BOUNDARY ? PRIMARY_COLOR : 'white'}>
        <S.Wave percentage={percentage}></S.Wave>
        <S.Layer percentage={percentage}></S.Layer>
        <span>{textContent}</span>
      </S.Wrap>
    </S.WaveContainer>
  );
};

interface Goal {
  idx: number;
  title: string;
  labelIdx: number;
  goalAmount: number;
  currentAmount: number;
  over: boolean;
}

interface GoalProps {
  goal: Goal;
}

const Goal = ({ goal }: GoalProps) => {
  const { idx, title, labelIdx, currentAmount, goalAmount, over } = goal;
  const label = labelMap.get(labelIdx);
  if (!label) return <></>;
  const { title: labelTitle, color: labelColor, unit: labelUnit } = label;

  const isPast = true;
  const rate = over ? Math.min(currentAmount / goalAmount, 1) : currentAmount <= goalAmount ? 1 : isPast ? 0 : 0.5;
  const rateString = rate >= 1 ? 'success' : over ? (100 * rate).toFixed(0).toString() + '%' : isPast ? 'failed' : 'progress';

  return (
    <S.Goal>
      <div>
        <GoalLabel title={labelTitle} color={labelColor} unit={labelUnit} amount={goalAmount} over={over} />
      </div>
      <span>{title}</span>
      <div>
        <S.Current>
          <div>
            <S.CurrentAmount>{currentAmount}</S.CurrentAmount>
          </div>
          <div>{labelUnit}</div>
        </S.Current>
      </div>
      <span>
        <WaveContainer textContent={rateString} percentage={rate} />
      </span>
    </S.Goal>
  );
};

interface LabelProps {
  title: string;
  color: string;
  unit: string;
  amount: number;
  over: boolean;
}

const GoalLabel = ({ title, color, unit, amount, over }: LabelProps) => {
  return (
    <S.Label color={color}>
      <S.LabelTitle>{title}</S.LabelTitle>
      <S.LabelAmountContainer>
        <S.LabelAmount length={amount.toString().length}>{amount}</S.LabelAmount>
        <span>{unit}</span>
      </S.LabelAmountContainer>
      <S.LabelOver>{over ? '▲' : '▼'}</S.LabelOver>
    </S.Label>
  );
};

export default GoalManager;
