import React, { useState } from 'react';
import { EngMonth, Days, WEEK_LENGTH, Menus } from '../../../../constants';
import * as S from './style';

const getLastDate = (date: Date): number => {
  const copy = new Date(date);
  copy.setMonth(copy.getMonth() + 1);
  copy.setDate(0);
  return copy.getDate();
};

const getFirstDay = (date: Date) => {
  const copy = new Date(date);
  copy.setDate(1);
  return copy.getDay();
};

const createArray = (length: number) => new Array(length).fill(1);

const Calendar = () => {
  const [date, setDate] = useState(new Date());
  const [selectedMenu, setSelectedMenu] = useState('LOG');

  const handleMonthArrowClick = (direction: number) => {
    setDate((date) => {
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() + direction);
      return newDate;
    });
  };

  const handleMenuClickEvent = (e: React.MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const index = target.dataset.menu;
    if (index) setSelectedMenu(index);
  };

  const firstDay = getFirstDay(date);
  const lastDate = getLastDate(date);

  return (
    <>
      <S.CalendarTitle>CAL</S.CalendarTitle>
      <S.CalendarContainer>
        <S.MonthSelector>
          <S.CurrentYear>{date.getFullYear()}</S.CurrentYear>
          <S.CurrentMonth>{EngMonth[date.getMonth()]}</S.CurrentMonth>
          <S.Arrow direction="left" onClick={() => handleMonthArrowClick(-1)}>
            {'<'}
          </S.Arrow>
          <S.Arrow direction="right" onClick={() => handleMonthArrowClick(1)}>
            {'>'}
          </S.Arrow>
        </S.MonthSelector>
        <S.DaysHeader>
          {createArray(WEEK_LENGTH).map((_, idx) => {
            return <S.DaysText key={Days[idx]}>{Days[idx]}</S.DaysText>;
          })}
        </S.DaysHeader>
        <S.DateSelector>
          {createArray(firstDay).map((_, idx) => {
            return <S.DateBox key={'emptyBox' + idx}></S.DateBox>;
          })}
          {createArray(lastDate).map((_, idx) => {
            return (
              <S.DateBox key={'date' + (idx + 1)}>
                <S.DateLogo percentage={Math.ceil(Math.random() * 100).toString()}>B</S.DateLogo>
                <S.Date>{idx + 1}</S.Date>
              </S.DateBox>
            );
          })}
        </S.DateSelector>
        <S.MenuSelector>
          {Menus.map((menu) => {
            return (
              <S.MenuBtn key={menu} data-menu={menu} onClick={handleMenuClickEvent} isActivatedMenu={menu === selectedMenu}>
                {menu}
              </S.MenuBtn>
            );
          })}
        </S.MenuSelector>
      </S.CalendarContainer>
    </>
  );
};

export default Calendar;
