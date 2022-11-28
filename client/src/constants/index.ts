export const HOST = process.env.REACT_APP_MODE === 'dev' ? process.env.REACT_APP_DEV_HOST : process.env.REACT_APP_PROD_HOST;
export const DEFAULT_PROFILE_IMG_URL = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png';
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
interface RoutePathType {
  [key: string]: string;
}
export const RoutePath: RoutePathType = {
  ROOT: '/',
  SIGNUP: '/signup',
  LOGIN: '/login',
  MAIN: '/main/*',
  LOG: '/main/log',
  DIARY: '/main/diary',
};

export const MODAL_CENTER_TOP = '50%';
export const MODAL_CENTER_LEFT = '50%';
export const MODAL_CENTER_TRANSFORM = 'translate(-50%, -50%)';
