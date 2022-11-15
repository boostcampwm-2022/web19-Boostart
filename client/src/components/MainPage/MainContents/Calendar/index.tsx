import React, { useState, useEffect } from 'react';
import useCurrentDate from '../../../../hooks/useCurrentDate';
import { CurrentDate } from 'GlobalType';
import { EngMonth, Days, WEEK_LENGTH, Menus } from '../../../../constants';
import * as S from './style';

const Calendar = () => {
  const [currentDate, setCurrentDate, prevMonth, nextMonth] = useCurrentDate({ year: 2022, month: 0 });
  const [selectedMenu, setSelectedMenu] = useState<string>('LOG');

  const handleMenuClickEvent = (e: React.MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const index = target.dataset.menu;
    if (index) setSelectedMenu(index);
  };

  const startDay = new Date(currentDate.year, currentDate.month, 1).getDay();
  const lastDate = new Date(currentDate.year, currentDate.month + 1, 0).getDate();
  //텍스트 gradation 적용을 위한 더미데이터
  const DummyPercentage = (currentDate: CurrentDate) => {
    const lastDate = new Date(currentDate.year, currentDate.month + 1, 0).getDate();
    return new Array(lastDate).fill(Math.ceil(Math.random() * 100).toString());
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    setCurrentDate({ year: currentYear, month: currentMonth });
  }, []);
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
          {new Array(WEEK_LENGTH).fill(true).map((_, idx) => {
            return <S.DaysText>{Days[idx]}</S.DaysText>;
          })}
        </S.DaysHeader>
        <S.DateSelector>
          {new Array(startDay).fill(true).map((_, idx) => {
            return <S.DateBox></S.DateBox>;
          })}
          {new Array(lastDate).fill(true).map((_, idx) => {
            return (
              <S.DateBox>
                <S.DateLogo percentage={DummyPercentage(currentDate)[idx]}>B</S.DateLogo>
                <S.Date>{idx + 1}</S.Date>
              </S.DateBox>
            );
          })}
        </S.DateSelector>
        <S.MenuSelector>
          {Menus.map((menu, idx) => {
            return (
              <S.MenuBtns key={idx} data-menu={menu} onClick={handleMenuClickEvent} isActivatedMenu={menu === selectedMenu}>
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
