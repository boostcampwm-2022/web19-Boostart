import styled from 'styled-components';

export const CalendarTitle = styled.span`
  display: inline-block;
  color: white;
  font-size: 1.7rem;
  font-family: 'Press Start 2P', cursive;
  transform: translate(1.75rem, 0.43rem);
  z-index: 1;
`;
export const CalendarContainer = styled.div`
  width: 100%;
  height: 36rem;
  background: white;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.5rem;
  align-items: center;
  margin-top: 0rem;
  box-shadow: 0px 0px 10px 5px rgba(175, 175, 175, 0.25);
  user-select: none;
`;
export const MonthSelector = styled.div`
  width: 20rem;
  height: 3rem;
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
  font-size: 1rem;
  font-family: 'Press Start 2P', cursive;
  grid-area: year;
  cursor: default;
`;

export const CurrentMonth = styled.div`
  display: flex;
  justify-content: center;
  color: #99b1db;
  font-size: 1.5rem;
  font-family: 'Press Start 2P', cursive;
  grid-area: month;
  cursor: default;
`;
export const Arrow = styled.div<{
  direction: string;
}>`
  color: #99b1db;
  font-size: 1.5rem;
  font-family: 'Press Start 2P', cursive;
  grid-area: ${(props) => props.direction};
  cursor: pointer;
`;
export const DaysHeader = styled.div`
  width: 20rem;
  height: 1.5rem;
  margin: 2.25rem auto 0.5rem;
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
  font-size: 0.625rem;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: default;
`;
export const DateSelector = styled.div`
  width: 19.7rem;
  height: 18rem;
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(auto-fill, minmax(3rem, 1fr));
`;

export const DateBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
`;

export const TodayMarker = styled.div<{
  isToday: boolean;
}>`
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  border-radius: 5rem;
  margin-bottom: 0.25rem;
  text-align: center;
  background: ${(props) => (props.isToday ? '#cadfff' : '#FFFFFF')};
`;

export const Date = styled.span`
  margin-top: -0.25rem;
  color: #8b8b8b;
  font-size: 0.5rem;
  font-weight: 700;
  font-family: 'Noto Sans KR', sans-serif;
  text-align: center;
  cursor: pointer;
  pointer-events: none;
`;

export const DateLogo = styled.span<{
  percentage: number;
}>`
  font-size: 2rem;
  font-family: 'Baumans', cursive;
  background: linear-gradient(to top, #99b1db ${(props) => props.percentage}%, #ddd 0%);
  -webkit-background-clip: text;
  color: transparent;
  cursor: pointer;
  pointer-events: none;
`;

export const MenuSelector = styled.div`
  width: 17.5rem;
  height: 2.5rem;
  border: 1px solid #e4e4e4;
  border-radius: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MenuButton = styled.div<{
  isActivatedMenu: boolean;
}>`
  width: 3.5rem;
  color: ${(props) => (props.isActivatedMenu ? '#000000' : '#a3a3a3')};
  font-size: 0.8rem;
  font-weight: ${(props) => (props.isActivatedMenu ? '700' : '400')};
  font-family: 'Inter', sans-serif;
  text-align: center;
  cursor: pointer;
`;
