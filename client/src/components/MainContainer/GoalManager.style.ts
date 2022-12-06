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

export const GOAL_MODAL_BORDER_RADIUS = '2rem';
export const GoalModal = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
  background-color: white;
  border-radius: ${GOAL_MODAL_BORDER_RADIUS};
`;

export const GoalModalLabel = styled.div<{ color?: string }>`
  display: flex;
  background-color: ${(props) => props.color ?? 'transparent'};
  justify-content: space-evenly;
  align-items: center;
  border: solid 1px ${(props) => (props.color ? 'transparent' : 'black')};

  width: 15rem;
  height: 1.5rem;
  padding: 0.4rem;
  border-radius: 20rem;
`;

export const GoalModalLabelTitleInput = styled.input`
  width: 15rem;
  font-size: 1.7rem;

  margin: auto;
  text-align: center;
  outline: none;
  border: none;
  border-bottom: 1px solid #cccccc;
  margin-bottom: 2rem;
`;

export const GoalModalLabelSetButton = styled.button`
  display: flex;
  width: 1.5rem;
  height: 0;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 3rem;
  border: 0.8px solid black;
  background-color: transparent;
`;

export const GoalModalAmountInput = styled.input`
  width: 3.2rem;

  text-align: center;

  background-color: transparent;
  border: none;
  outline: none;
`;

export const GoalModalSubmitButton = styled.button`
  border-radius: 2rem;
  margin-top: 2rem;

  padding: 1.5rem;
  background-color: var(--color-main);
  color: white;
  outline: none;
  border: none;
  /* height: 2.3rem; */
  font-family: var(--font-title);
`;

export const LabelListContainer = styled.div`
  width: 23rem;
  height: 2.3rem;
  margin-top: 2rem;
`;

export const LabelModal = styled.form`
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  height: 12rem;
  display: flex;
  flex-direction: column;
`;

export const LabelModalLabel = styled.div<{ color: string }>`
  display: flex;
  background-color: ${(props) => props.color};
  border-radius: 3rem;
  ${(props) => (props.color ? 'border: none;' : '')}
  padding: 0.5rem;
  margin-top: 2rem;
  input {
    margin: 0 1rem;
    background-color: transparent;
    border: none;
    outline: none;
  }
`;

export const LabelModalLabelTitleInput = styled.input`
  width: 3.2rem;
`;

export const LabelModalLabelUnitInput = styled.input`
  width: 2.2rem;
`;

export const LabelModalLabelColorInput = styled.input`
  width: 2rem;
`;

export const LabelModalLabelCreateButton = styled.button`
  outline: none;
  border: none;
  margin: auto;
  margin-bottom: 1rem;
  border-radius: 0.3rem;
  font-family: 'Press Start 2P', cursive;
  background-color: var(--color-main);
  color: white;
  padding: 0.5rem;
  border-radius: 3rem;
  width: max-content;
`;

export const GoalModalLabelName = styled.input<{ filled: boolean }>`
  width: 6rem;

  background-color: transparent;
  border: none;
  outline: none;

  ${(props) => (props.filled ? 'text-align: center' : '')}
`;

export const VertialRule = styled.div`
  border: none;
  border-right: solid 1px grey;
  margin: 5px 0;
`;

export const GoalModalOverInput = styled.div`
  width: 2rem;
  text-align: center;
`;
