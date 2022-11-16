import React, { useEffect, useState, MouseEvent } from 'react';
import { CurrentDate } from 'GlobalType';

type onClickType = (e: MouseEvent<HTMLElement>) => void;

const useCurrentDate = (initDate: CurrentDate) => {
  const [currentDate, setCurrentDate] = useState<CurrentDate>(initDate);

  const nextMonth = () => {
    const currentTime = new Date(currentDate.year, currentDate.month, 1);
    currentTime.setMonth(currentTime.getMonth() + 1);
    setCurrentDate({ year: currentTime.getFullYear(), month: currentTime.getMonth() });
  };

  const prevMonth = () => {
    const currentTime = new Date(currentDate.year, currentDate.month, 1);
    currentTime.setMonth(currentTime.getMonth() - 1);
    setCurrentDate({ year: currentTime.getFullYear(), month: currentTime.getMonth() });
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    setCurrentDate({ year: currentYear, month: currentMonth });
  }, []);

  return [currentDate, prevMonth, nextMonth] as [CurrentDate, onClickType, onClickType];
};
export default useCurrentDate;
