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
