import React, { useState, useEffect } from 'react';
import * as S from './style';

interface CurrentDate {
  year: number;
  month: string;
}
enum EngMonth {
  'JAUARY',
  'FABUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
}

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
      </S.CalendarContainer>
    </>
  );
};

export default Calendar;
