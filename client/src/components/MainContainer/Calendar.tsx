import React, { useEffect, useState } from 'react';
import useCurrentDate from '../../hooks/useCurrentDate';
import { EngMonth, Days, WEEK_LENGTH, HOST } from '../../constants';
import MenuSelector from './MenuSelector';
import * as S from './Calendar.style';
import { useRecoilState } from 'recoil';
import { menuState, visitState, calendarState } from '../common/atoms';
import axios from 'axios';

interface DateContainerProps {
  calendarYear: number;
  calendarMonth: number;
  calendarDate: number;
  percent: number;
}

const createArray = (count: number) => {
  return new Array(count).fill(true);
};

const Calendar = () => {
  //States
  const { currentDate, getFirstDay, getLastDate } = useCurrentDate();
  const [calendarDate, setCalendarDate] = useState(currentDate);
  const [currentMenu, setCurrentMenu] = useRecoilState(menuState);
  const [currentVisit, setCurrentVisit] = useRecoilState(visitState);
  const [currentCalendar, setCurrentCalendar] = useRecoilState(calendarState);

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
    setCalendarDate(new Date(calendarDate));
  };

  useEffect(() => {
    setCalendarDate(new Date(currentDate));
  }, [currentDate]);

  useEffect(() => {
    const getCalendarData = async () => {
      try {
        if (currentMenu == 'LOG' || currentMenu == 'MAP' || currentMenu == 'DIARY') {
          const result = currentVisit.isMe
            ? await axios.get(`${HOST}/api/v1/calendar/task?year=${calendarDate.getFullYear()}&month=${calendarDate.getMonth() + 1}`)
            : await axios.get(`${HOST}/api/v1/calendar/task/${currentVisit.userId}?year=${calendarDate.getFullYear()}&month=${calendarDate.getMonth() + 1}`);
          setCurrentCalendar(result.data);
        } else if (currentMenu == 'GOAL') {
          const result = currentVisit.isMe
            ? await axios.get(`${HOST}/api/v1/calendar/goal?year=${calendarDate.getFullYear()}&month=${calendarDate.getMonth() + 1}`)
            : await axios.get(`${HOST}/api/v1/calendar/goal/${currentVisit.userId}?year=${calendarDate.getFullYear()}&month=${calendarDate.getMonth() + 1}`);
          setCurrentCalendar(result.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCalendarData();
  }, [calendarDate.getMonth(), currentMenu, currentVisit]);

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
            return <DateContainer key={'date' + (idx + 1)} calendarYear={calendarDate.getFullYear()} calendarDate={idx + 1} calendarMonth={calendarDate.getMonth()} percent={currentCalendar[idx]}></DateContainer>;
          })}
        </S.DateSelector>
        <MenuSelector />
      </S.CalendarContainer>
    </>
  );
};

const DateContainer = ({ calendarYear, calendarMonth, calendarDate, percent }: DateContainerProps) => {
  const { getNewDate, getYear, getMonth, getDate } = useCurrentDate();
  const isToday = calendarYear === getYear() && calendarMonth === getMonth() && calendarDate === getDate();
  const selectCurrentDate = () => {
    getNewDate(calendarYear, calendarMonth, calendarDate);
  };
  return (
    <>
      <S.DateBox onClick={selectCurrentDate}>
        <S.TodayMarker isToday={isToday}>
          <S.LogoWrapper>
            <S.DateLogo percentage={percent * 100}>B</S.DateLogo>
          </S.LogoWrapper>
        </S.TodayMarker>
        <S.Date>{calendarDate}</S.Date>
      </S.DateBox>
    </>
  );
};

export default Calendar;
