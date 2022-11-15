export const HOST = process.env.REACT_APP_HOST;
export enum EngMonth {
  'JAUARY',
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
export const WEEK_LENGTH = Object.keys(Days).length / 2;
