import { useRecoilState } from 'recoil';
import { dateState } from '../components/common/atoms';

const useCurrentDate = () => {
  const [currentDate, setCurrentDate] = useRecoilState<Date>(dateState);

  const getNextMonth = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(new Date(currentDate));
  };

  const getPrevMonth = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(new Date(currentDate));
  };

  const getPrevDate = () => {
    currentDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(new Date(currentDate));
  };

  const getNextDate = () => {
    currentDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(new Date(currentDate));
  };

  const getNewDate = (selectedYear: number, selectedMonth: number, selectedDate: number) => {
    setCurrentDate(new Date(selectedYear, selectedMonth, selectedDate));
  };

  const getFirstDay = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  const getLastDate = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getMonth = () => {
    return currentDate.getMonth();
  };

  const getYear = () => {
    return currentDate.getFullYear();
  };

  const getDate = () => {
    return currentDate.getDate();
  };
  const DateToString = (date: Date = currentDate) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  return {
    currentDate,
    getPrevMonth,
    getNextMonth,
    getFirstDay,
    getLastDate,
    getPrevDate,
    getNextDate,
    getNewDate,
    getMonth,
    getYear,
    getDate,
    DateToString,
  };
};
export default useCurrentDate;
