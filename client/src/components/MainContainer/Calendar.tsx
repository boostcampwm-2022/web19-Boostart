import React, { useEffect, useState } from 'react';
import useCurrentDate from '../../hooks/useCurrentDate';
import { EngMonth, Days, WEEK_LENGTH, Menus } from '../../constants';
import * as S from './Calendar.style';

interface DateContainerProps {
  calendarYear: number;
  calendarMonth: number;
  calendarDate: number;
}

const createArray = (count: number) => {
  return new Array(count).fill(true);
};

const Calendar = () => {
  //States
  const { currentDate, getFirstDay, getLastDate } = useCurrentDate();
  const [calendarDate, setCalendarDate] = useState(currentDate);
  const [selectedMenu, setSelectedMenu] = useState('LOG');
  //Vars
  const firstDay = getFirstDay(calendarDate);
  const lastDate = getLastDate(calendarDate);
  const weekDays = createArray(WEEK_LENGTH);
  const daysBeforeFirstDay = createArray(firstDay);
  const monthDays = createArray(lastDate);
  //Functions
  const handleMenuClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const index = target.dataset.menu;
    if (index) setSelectedMenu(index);
  };

  const handlePrevMonthClick = () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    setCalendarDate(new Date(calendarDate));
  };

  const handleNextMonthClick = () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    console.log(calendarDate.getFullYear());
    setCalendarDate(new Date(calendarDate));
  };

  useEffect(() => {
    //전역 date state 가 변경되면 달력 state도 함께 변경
    setCalendarDate(new Date(currentDate));
  }, [currentDate]);

  return (
    <>
      <S.CalendarTitle>CAL</S.CalendarTitle>
      <S.CalendarContainer>
        <S.MonthSelector>
          <S.CurrentYear>{calendarDate.getFullYear()}</S.CurrentYear>
          <S.CurrentMonth>{EngMonth[calendarDate.getMonth()]}</S.CurrentMonth>
          {/* 달력 변경시에는 달력만 변경되도록 전역 state가 아닌 별도 state로 관리 */}
          <S.Arrow direction="left" onClick={handlePrevMonthClick}>
            {'<'}
          </S.Arrow>
          <S.Arrow direction="right" onClick={handleNextMonthClick}>
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
            return <div key={'emptyBox' + idx}></div>;
          })}
          {monthDays.map((_, idx) => {
            return <DateContainer key={'date' + (idx + 1)} calendarYear={calendarDate.getFullYear()} calendarDate={idx + 1} calendarMonth={calendarDate.getMonth()}></DateContainer>;
          })}
        </S.DateSelector>
        <S.MenuSelector>
          {Menus.map((menu) => {
            return (
              <S.MenuButton key={menu} data-menu={menu} onClick={handleMenuClick} isActivatedMenu={menu === selectedMenu}>
                {menu}
              </S.MenuButton>
            );
          })}
        </S.MenuSelector>
      </S.CalendarContainer>
    </>
  );
};

const DateContainer = ({ calendarYear, calendarMonth, calendarDate }: DateContainerProps) => {
  const { getNewDate, getYear, getMonth, getDate } = useCurrentDate();
  const isToday = calendarYear === getYear() && calendarMonth === getMonth() && calendarDate === getDate();
  const selectCurrentDate = () => {
    getNewDate(calendarYear, calendarMonth, calendarDate);
  };
  return (
    <>
      <S.DateBox onClick={selectCurrentDate}>
        <S.TodayMarker isToday={isToday}>
          <S.DateLogo percentage={100}>B</S.DateLogo>
        </S.TodayMarker>
        <S.Date>{calendarDate}</S.Date>
      </S.DateBox>
    </>
  );
};

export default Calendar;
