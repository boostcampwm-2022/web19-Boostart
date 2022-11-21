import { useState, MouseEvent } from 'react';

type onClickType = (e: MouseEvent<HTMLElement>) => void;

const useCurrentDate = (initDate: Date) => {
  const [currentDate, setCurrentDate] = useState<Date>(initDate);

  const getNextMonth = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(new Date(currentDate));
  };

  const getPrevMonth = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(new Date(currentDate));
  };

  const getFirstDay = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  };
  const getLastDate = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  };

  return [currentDate, getPrevMonth, getNextMonth, getFirstDay, getLastDate] as [Date, onClickType, onClickType, Function, Function];
};
export default useCurrentDate;
