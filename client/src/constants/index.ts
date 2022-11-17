export const HOST = process.env.REACT_APP_HOST;
export enum EngMonth {
  'JANUARY',
  'FABUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
}
export enum Days {
  '일',
  '월',
  '화',
  '수',
  '목',
  '금',
  '토',
}
export const Menus = ['LOG', 'DIARY', 'PLAN', 'MAP'];

export const WEEK_LENGTH = Object.keys(Days).length / 2;
