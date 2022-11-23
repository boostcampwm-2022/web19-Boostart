import { atom } from 'recoil';

export const dateState = atom({
  key: 'currentDate',
  default: new Date(),
});
