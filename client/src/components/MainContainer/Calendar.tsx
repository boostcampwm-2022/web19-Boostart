import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCurrentDate from '../../hooks/useCurrentDate';
import { EngMonth, Days, WEEK_LENGTH, Menus, RoutePath } from '../../constants';
import * as S from './Calendar.style';

interface DateContainerProps {
  calendarYear: number;
  calendarMonth: number;
  calendarDate: number;
}
interface MenuLinkButtonProps {
  menu: string;
}

const createArray = (count: number) => {
  return new Array(count).fill(true);
};

const Calendar = () => {
  //States
  const { currentDate, getFirstDay, getLastDate } = useCurrentDate();
  const [calendarDate, setCalendarDate] = useState(currentDate);
  //Vars
  const firstDay = getFirstDay(calendarDate);
  const lastDate = getLastDate(calendarDate);
  const weekDays = createArray(WEEK_LENGTH);
  const daysBeforeFirstDay = createArray(firstDay);
  const monthDays = createArray(lastDate);
  //Functions

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
    setCalendarDate(new Date(currentDate));
  }, [currentDate]);

  return (
    <>
      <S.CalendarTitle>CAL</S.CalendarTitle>
      <S.CalendarContainer>
        <S.MonthSelector>
          <S.CurrentYear>{calendarDate.getFullYear()}</S.CurrentYear>
          <S.CurrentMonth>{EngMonth[calendarDate.getMonth()]}</S.CurrentMonth>
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
            return <MenuLinkButton key={menu} menu={menu} />;
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

const MenuLinkButton = ({ menu }: MenuLinkButtonProps) => {
  const [selectedMenu, setSelectedMenu] = useState('LOG');
  const navigate = useNavigate();
  const handleMenuClick = (e: React.MouseEvent) => {
    const target = e.target;
    if (!(target instanceof HTMLDivElement)) return;
    const selectedMenu = target.dataset.menu;
    if (selectedMenu) {
      setSelectedMenu(selectedMenu);
      navigate(RoutePath[selectedMenu]);
    }
  };

  return (
    <S.MenuButton key={menu} data-menu={menu} onClick={handleMenuClick} isActivatedMenu={menu === selectedMenu}>
      {menu}
    </S.MenuButton>
  );
};
