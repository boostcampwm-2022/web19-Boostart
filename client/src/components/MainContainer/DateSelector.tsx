import useCurrentDate from '../../hooks/useCurrentDate';
import styled from 'styled-components';
import * as S from './Log.style';

interface DateSelectArrowProps {
  direction: 'prev' | 'next';
}

export const DateController = styled.span`
  width: 14rem;
  color: var(--color-main);
  font-size: 1.5rem;
  font-family: 'Press Start 2P', cursive;
  display: flex;
  justify-content: space-between;
  cursor: default;
`;

const DateSelector = () => {
  const { getMonth, getDate } = useCurrentDate();

  return (
    <DateController>
      <DateSelectArrow direction="prev" />
      {getMonth() + 1}.{getDate()}
      <DateSelectArrow direction="next" />
    </DateController>
  );
};

const DateSelectArrow = ({ direction }: DateSelectArrowProps) => {
  const { getPrevDate, getNextDate } = useCurrentDate();
  const directionArrow = direction === 'prev' ? '<' : '>';
  const changeCurrentDate = () => {
    if (direction === 'prev') getPrevDate();
    else getNextDate();
  };
  return (
    <>
      <S.DateArrow onClick={changeCurrentDate}>{directionArrow}</S.DateArrow>
    </>
  );
};

export default DateSelector;
