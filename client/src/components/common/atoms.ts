import { atom } from 'recoil';

export const dateState = atom({
  key: 'currentDate',
  default: new Date(),
});
export const visitState = atom({
  key: 'currentVisiting',
  default: { userId: '', isMe: true },
});
export const menuState = atom({
  key: 'currentMenu',
  default: '',
});
