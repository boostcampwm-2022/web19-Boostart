import { useState, MouseEvent } from 'react';

type onClickType = (e: MouseEvent<HTMLElement>) => void;

const useCurrentDate = (initDate: Date) => {
  const [currentDate, setCurrentDate] = useState<Date>(initDate);

  const nextMonth = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(new Date(currentDate));
  };

  const prevMonth = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(new Date(currentDate));
  };

  return [currentDate, prevMonth, nextMonth] as [Date, onClickType, onClickType];
};
export default useCurrentDate;
