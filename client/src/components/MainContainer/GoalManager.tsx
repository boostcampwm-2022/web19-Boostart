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
    goalAmount: 680,
    currentAmount: 300,
    over: true,
  },
  {
    idx: 3,
    title: '절약',
    labelIdx: 2,
    goalAmount: 2,
    currentAmount: 1.2,
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
    title: '',
    color: '',
    unit: '',
  },
  {
    title: '커피',
    color: '#4A6CC3',
    unit: '잔',
  },
  {
    title: '지출',
    color: '#D092E2',
    unit: '만',
  },
  {
    title: '잠',
    color: '#B9D58C',
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
  const rateString = rate >= 1 ? 'success' : over ? (100 * rate).toFixed(0).toString() + '%' : isPast ? 'failed' : 'progress';

  return (
    <S.Goal>
      <div>
        <Label title={labelTitle} color={labelColor} unit={labelUnit} amount={goalAmount} over={over} />
      </div>
      <span>{title}</span>{' '}
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

const Label = ({ title, color, unit, amount, over }: LabelProps) => {
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
