import React, { useState, useEffect } from 'react';
import useCurrentDate from '../../../../hooks/useCurrentDate';
import { CurrentDate } from 'GlobalType';
import { EngMonth, Days, WEEK_LENGTH, Menus } from '../../../../constants';
import * as S from './style';

const Calendar = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [currentDate, prevMonth, nextMonth] = useCurrentDate({ year: currentYear, month: currentMonth });
  const [selectedMenu, setSelectedMenu] = useState('LOG');

  const handleMenuClickEvent = (e: React.MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const index = target.dataset.menu;
    if (index) setSelectedMenu(index);
  };

  const elementList = (count: number) => {
    return new Array(count).fill(true);
  };

  const startDay = new Date(currentDate.year, currentDate.month, 1).getDay();
  const lastDate = new Date(currentDate.year, currentDate.month + 1, 0).getDate();
  //텍스트 gradation 적용을 위한 더미데이터
  const DummyPercentage = (currentDate: CurrentDate) => {
    const lastDate = new Date(currentDate.year, currentDate.month + 1, 0).getDate();
    return new Array(lastDate).fill(Math.ceil(Math.random() * 100).toString());
  };

  return (
    <>
      <S.CalendarTitle>CAL</S.CalendarTitle>
      <S.CalendarContainer>
        <S.MonthSelector>
          <S.CurrentYear>{currentDate.year}</S.CurrentYear>
          <S.CurrentMonth>{EngMonth[currentDate.month]}</S.CurrentMonth>
          <S.Arrow direction="left" onClick={prevMonth}>
            {'<'}
          </S.Arrow>
          <S.Arrow direction="right" onClick={nextMonth}>
            {'>'}
          </S.Arrow>
        </S.MonthSelector>
        <S.DaysHeader>
          {elementList(WEEK_LENGTH).map((_, idx) => {
            return <S.DaysText key={Days[idx]}>{Days[idx]}</S.DaysText>;
          })}
        </S.DaysHeader>
        <S.DateSelector>
          {elementList(startDay).map((_, idx) => {
            return <S.DateBox key={'emptyBox' + idx}></S.DateBox>;
          })}
          {elementList(lastDate).map((_, idx) => {
            return (
              <S.DateBox key={'date' + (idx + 1)}>
                <S.DateLogo percentage={DummyPercentage(currentDate)[idx]}>B</S.DateLogo>
                <S.Date>{idx + 1}</S.Date>
              </S.DateBox>
            );
          })}
        </S.DateSelector>
        <S.MenuSelector>
          {Menus.map((menu) => {
            return (
              <S.MenuBtns key={menu} data-menu={menu} onClick={handleMenuClickEvent} isActivatedMenu={menu === selectedMenu}>
                {menu}
              </S.MenuBtns>
            );
          })}
        </S.MenuSelector>
      </S.CalendarContainer>
    </>
  );
};

export default Calendar;
