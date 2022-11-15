import React, { useState, useEffect } from 'react';
import { CurrentDate } from 'GlobalType';
import { EngMonth, Days, WEEK_LENGTH } from '../../../../constants';
import * as S from './style';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState<CurrentDate>({ year: 2022, month: '' });
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = EngMonth[new Date().getMonth()];
    setCurrentDate({ year: currentYear, month: currentMonth });
  }, []);
  return (
    <>
      <S.CalendarTitle>CAL</S.CalendarTitle>
      <S.CalendarContainer>
        <S.DateSelector>
          <S.CurrentYear>{currentDate.year}</S.CurrentYear>
          <S.CurrentMonth>{currentDate.month}</S.CurrentMonth>
          <S.LeftArrow>{'<'}</S.LeftArrow>
          <S.RightArrow>{'>'}</S.RightArrow>
        </S.DateSelector>
        <S.DaysHeader>
          {new Array(WEEK_LENGTH).fill(true).map((_, idx) => {
            return <S.DaysText>{Days[idx]}</S.DaysText>;
          })}
        </S.DaysHeader>
      </S.CalendarContainer>
    </>
  );
};

export default Calendar;
