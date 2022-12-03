import styled, { keyframes } from 'styled-components';

const drift = keyframes`
  0% {
    border-radius: 37%;
  }
  100% {
    transform: rotate(-360deg);
  }
`;

const goalVerticalPadding = '0.8rem';
export const Goal = styled.div`
  font-family: 'Noto Sans KR';
  display: flex;
  align-items: center;
  width: 40rem;
  padding: ${goalVerticalPadding};
  border-radius: 3rem;
  background-color: white;
  box-shadow: 0px 0px 10px 5px rgb(175 175 175 / 15%);
  margin: 0.5rem auto;
  * {
    flex: 1;
    text-align: center;
  }
`;

export const GoalHead = styled(Goal)`
  font-family: 'Noto Sans';
  background-color: #f2f2f2;
  box-shadow: none;
  padding: 0.5rem ${goalVerticalPadding};
`;

export const WaveContainer = styled.div`
  padding: 2.5px;
  border-radius: 25px;
  border: 2px solid #a7a5e7;
  background-color: white;
`;

export const Wrap = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  overflow: hidden;

  padding: 0.5rem 1rem;
  border-radius: 2rem;
  background: white;

  transform: translate3d(0, 0, 0);

  span {
    font-size: 0.9rem;
    font-family: 'Press Start 2P', cursive;
    color: ${(props) => props.color};
    text-align: left;
    z-index: 100;
  }
`;

export const Wave = styled.div<{ percentage: number }>`
  position: absolute;
  top: -13rem;
  left: calc(-33rem + ${(props) => props.percentage * 11.5}rem);

  width: 31rem;
  height: 31rem;

  background: linear-gradient(#a7a5e734, #99b1db34);
  border-radius: 44%;

  animation: ${drift} 6s infinite linear;
`;

export const Layer = styled(Wave)`
  border-radius: 41%;

  animation: ${drift} 12s infinite linear;
`;

const LABEL_FONT_SIZE = '0.9rem';
export const Label = styled.div<{ color: string }>`
  margin: auto;

  display: flex;
  align-items: center;

  width: 8rem;
  padding: 0.2rem;

  border-radius: 2rem;

  background-color: ${(props) => props.color};

  font-size: ${LABEL_FONT_SIZE};
  color: white;
`;

export const LabelTitle = styled.div`
  flex: 3;
`;

export const LabelAmountContainer = styled.div`
  flex: 3;

  display: flex;
  align-items: center;
  * {
    flex: 1;
  }
`;

export const LabelAmount = styled.div<{ length: number }>`
  font-size: calc(${LABEL_FONT_SIZE} / ${(props) => props.length});
`;

export const LabelOver = styled.div`
  flex: 1;
  font-size: calc(${LABEL_FONT_SIZE} * 0.7);
`;

export const Current = styled.div`
  margin: auto;
  width: 5rem;

  display: flex;
  align-items: center;
`;

export const CurrentAmount = styled.div`
  margin: auto;
  flex: 2;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 0;
  height: 0;
  padding: 1.2rem;

  border-radius: 50%;
  border: 1px solid #eeeeee;
  box-shadow: 0px 0px 10px 5px rgb(175 175 175 / 10%);

  color: var(--color-main);
`;
