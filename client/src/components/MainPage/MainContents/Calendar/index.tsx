import React, { useState, useEffect } from 'react';
import * as S from './style';

interface CurrentTime {
  hour: string;
  minute: string;
}

const Calendar = () => {
  useEffect(() => {}, []);
  return (
    <>
      <S.CalendarTitle>CAL</S.CalendarTitle>
      <S.CalendarContainer></S.CalendarContainer>
    </>
  );
};

export default Calendar;
