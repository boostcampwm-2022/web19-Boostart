import React, { useState } from 'react';
import useCurrentDate from '../../hooks/useCurrentDate';
import { EngMonth, Days, WEEK_LENGTH, Menus } from '../../constants';
import * as S from './Calendar.style';

const createArray = (count: number) => {
  return new Array(count).fill(true);
};

const Calendar = () => {
  const [currentDate, getPrevMonth, getNextMonth, getFirstDay, getLastDate] = useCurrentDate(new Date());
  const [selectedMenu, setSelectedMenu] = useState('LOG');

  const handleMenuClickEvent = (e: React.MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const index = target.dataset.menu;
    if (index) setSelectedMenu(index);
  };

  const firstDay = getFirstDay(currentDate);
  const lastDate = getLastDate(currentDate);
  const weekDays = createArray(WEEK_LENGTH);
  const daysBeforeFirstDay = createArray(firstDay);
  const monthDays = createArray(lastDate);

  return (
    <>
      <S.CalendarTitle>CAL</S.CalendarTitle>
      <S.CalendarContainer>
        <S.MonthSelector>
          <S.CurrentYear>{currentDate.getFullYear()}</S.CurrentYear>
          <S.CurrentMonth>{EngMonth[currentDate.getMonth()]}</S.CurrentMonth>
          <S.Arrow direction="left" onClick={getPrevMonth}>
            {'<'}
          </S.Arrow>
          <S.Arrow direction="right" onClick={getNextMonth}>
            {'>'}
          </S.Arrow>
        </S.MonthSelector>
        <S.DaysHeader>
          {weekDays.map((_, idx) => {
            return <S.DaysText key={Days[idx]}>{Days[idx]}</S.DaysText>;
          })}
        </S.DaysHeader>
        <S.DateSelector>
          {daysBeforeFirstDay.map((_, idx) => {
            return <S.DateBox key={'emptyBox' + idx}></S.DateBox>;
          })}
          {monthDays.map((_, idx) => {
            return (
              <S.DateBox key={'date' + (idx + 1)}>
                <S.DateLogo percentage={Math.ceil(Math.random() * 100)}>B</S.DateLogo>
                <S.Date>{idx + 1}</S.Date>
              </S.DateBox>
            );
          })}
        </S.DateSelector>
        <S.MenuSelector>
          {Menus.map((menu) => {
            return (
              <S.MenuButton key={menu} data-menu={menu} onClick={handleMenuClickEvent} isActivatedMenu={menu === selectedMenu}>
                {menu}
              </S.MenuButton>
            );
          })}
        </S.MenuSelector>
      </S.CalendarContainer>
    </>
  );
};

export default Calendar;
