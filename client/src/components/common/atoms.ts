import { atom, selector } from 'recoil';

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
export const friendState = atom<Friend[]>({
  key: 'friendsList',
  default: [],
});
export const myInfo = atom<Friend | null>({
  key: 'myProfile',
  default: null,
});
export const calendarState = atom({
  key: 'currentCalendar',
  default: [],
});
