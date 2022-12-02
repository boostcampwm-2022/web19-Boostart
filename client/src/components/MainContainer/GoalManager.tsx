import SubContainer from './SubContainer';
import * as S from './GoalManager.style';

const GoalManager = () => {
  return (
    <>
      <S.GoalHead>
        <span>목표</span> <span>제목</span> <span>현황</span> <span>달성률</span>
      </S.GoalHead>
      {dummyGoals.map((goal) => (
        <Goal key={goal.idx} goal={goal} />
      ))}
    </>
  );
};

interface WaveProps {
  textContent: string;
  percentage: number;
}

const WaveContainer = ({ textContent, percentage }: WaveProps) => {
  const BOUNDARY = 0.3;
  return (
    <S.WaveContainer>
      <S.Wrap color={percentage <= BOUNDARY ? 'black' : 'white'}>
        <S.Wave percentage={percentage}></S.Wave>
        <S.Layer percentage={percentage}></S.Layer>
        <span>{textContent}</span>
      </S.Wrap>
    </S.WaveContainer>
  );
};

const dummyGoals = [
  {
    idx: 1,
    title: '커피 줄이기',
    labelIdx: 1,
    goalAmount: 2,
    currentAmount: 4,
    over: false,
  },
  {
    idx: 2,
    title: '잠좀자기',
    labelIdx: 3,
    goalAmount: 480,
    currentAmount: 300,
    over: true,
  },
  {
    idx: 3,
    title: '절약',
    labelIdx: 2,
    goalAmount: 20000,
    currentAmount: 12000,
    over: false,
  },
];

interface Label {
  color: string;
  title: string;
  unit: string;
}

const dummyLabels: Label[] = [
  {
    title: '커피',
    color: '#222222',
    unit: '잔',
  },
  {
    title: '커피',
    color: '#222222',
    unit: '잔',
  },
  {
    title: '지출',
    color: '#442222',
    unit: '원',
  },
  {
    title: '잠',
    color: '#225522',
    unit: '분',
  },
];

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
  const { title: labelTitle, color: labelColor, unit: labelUnit } = dummyLabels[labelIdx];

  const isPast = true;
  const rate = over ? currentAmount / goalAmount : currentAmount <= goalAmount ? 1 : isPast ? 0 : 0.5;
  const rateString = rate >= 1 ? 'COMPLETE' : over ? (100 * rate).toFixed(0).toString() + '%' : isPast ? 'FAILED' : 'PROGRESS';

  return (
    <S.Goal>
      <span>
        {labelTitle}
        {goalAmount}
        {labelUnit}
        {over ? '▲' : '▼'}
      </span>
      <span>{title}</span>{' '}
      <span>
        {currentAmount}
        {labelUnit}
      </span>
      <span>
        <WaveContainer textContent={rateString} percentage={rate} />
      </span>
    </S.Goal>
  );
};

export default GoalManager;
