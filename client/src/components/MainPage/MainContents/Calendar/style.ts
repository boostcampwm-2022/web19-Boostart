import styled from 'styled-components';

export const CalendarTitle = styled.span`
  display: inline-block;
  color: white;
  font-size: 2.5rem;
  font-family: 'Press Start 2P', cursive;
  transform: translate(1.75rem, 0.56rem);
`;
export const CalendarContainer = styled.div`
  width: 100%;
  height: 46rem;
  background: white;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 1px 5px 0 #8b8b8b;
`;
export const DateSelector = styled.div`
  width: 100%;
  height: 4rem;
  display: grid;
  grid-template-areas:
    '. year .'
    'left month right';
  grid-template-columns: 1fr 8fr 1fr;
  grid-template-rows: 1fr 1fr;
`;

export const CurrentYear = styled.div`
  display: flex;
  justify-content: center;
  color: #99b1db;
  font-size: 1.5rem;
  font-family: 'Press Start 2P', cursive;
  grid-area: year;
`;

export const CurrentMonth = styled.div`
  display: flex;
  justify-content: center;
  color: #99b1db;
  font-size: 2rem;
  font-family: 'Press Start 2P', cursive;
  grid-area: month;
`;
export const LeftArrow = styled.div`
  color: #99b1db;
  font-size: 2rem;
  font-family: 'Press Start 2P', cursive;
  grid-area: left;
`;
export const RightArrow = styled.div`
  color: #99b1db;
  font-size: 2rem;
  font-family: 'Press Start 2P', cursive;
  grid-area: right;
`;
export const DaysHeader = styled.div`
  width: 25.5rem;
  height: 2rem;
  margin: 2.5rem auto 1.5rem;
  padding: 0 0.5rem;
  border: 1px solid #ededed;
  border-radius: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;
export const DaysText = styled.span`
  color: #8f8f8f;
  font-size: 0.8rem;
  font-family: 'NOTO Sans KR';
`;
