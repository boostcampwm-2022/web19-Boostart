import { Task } from 'GlobalType';

export const dummyFriendList = [
  {
    idx: 0,
    userId: 'J059',
    username: 'mik',
    profileImg: 'https://ca.slack-edge.com/T03V2A4FCLA-U03V9JCAC74-042177e5237c-512',
  },
  {
    idx: 1,
    userId: 'J070',
    username: 'jerry',
    profileImg: 'https://ca.slack-edge.com/T03V2A4FCLA-U04081R1WV7-44a56ecae76d-512',
  },
  {
    idx: 2,
    userId: 'J084',
    username: 'mayo',
    profileImg: 'https://ca.slack-edge.com/T03V2A4FCLA-U03UV1S4G6B-eaf725283352-512',
  },
  {
    idx: 3,
    userId: 'J214',
    username: 'mozak',
    profileImg: 'https://ca.slack-edge.com/T03V2A4FCLA-U0408645KA5-803c24ea468e-512',
  },
];

export const dummyTaskList: Task[] = [
  {
    idx: 0,
    title: '데일리어쩌구',
    importance: 1,
    startedAt: '10:00',
    endedAt: '11:30',
    lat: 123,
    lng: 123,
    location: '압구정역',
    public: true,
    tag_idx: 0,
    tag_name: '부스트캠프',
    content: '아 어렵다',
    done: true,
    labels: [
      {
        idx: 0,
        color: 'red',
        title: '고통',
        amount: 10,
        unit: 'Kg',
      },
    ],
  },
  {
    idx: 1,
    title: '육아',
    importance: 5,
    startedAt: '00:00',
    endedAt: '23:59',
    lat: 123,
    lng: 123,
    location: '집',
    public: true,
    tag_idx: 1,
    tag_name: '육아',
    content: '아 힘들다',
    done: false,
    labels: [
      {
        idx: 1,
        color: 'yellow',
        title: '귀여움',
        amount: 20,
        unit: 'Kg',
      },
    ],
  },
  {
    idx: 2,
    title: '페어저쩌구',
    importance: 3,
    startedAt: '13:00',
    endedAt: '16:30',
    lat: 123,
    lng: 123,
    location: '줌',
    public: true,
    tag_idx: 0,
    tag_name: '부스트캠프',
    content: '아 재미있다',
    done: false,
    labels: [
      {
        idx: 3,
        color: 'blue',
        title: '공부',
        amount: 120,
        unit: '분',
      },
    ],
  },
  {
    idx: 3,
    title: '분유먹이기',
    importance: 4,
    startedAt: '12:00',
    endedAt: '12:30',
    lat: 123,
    lng: 123,
    location: '집',
    public: true,
    tag_idx: 1,
    tag_name: '육아',
    content: '맛있을까?',
    done: true,
    labels: [
      {
        idx: 1,
        color: 'yellow',
        title: '귀여움',
        amount: 20,
        unit: 'Kg',
      },
      {
        idx: 2,
        color: 'green',
        title: '분유',
        amount: 200,
        unit: 'ml',
      },
    ],
  },
  {
    idx: 4,
    title: '넷플릭스보기',
    importance: 2,
    startedAt: '20:00',
    endedAt: '21:30',
    lat: 123,
    lng: 123,
    location: '집',
    public: true,
    tag_idx: 2,
    tag_name: '일상',
    content: '요즘은 뭐가 재미있지?',
    done: false,
    labels: [
      {
        idx: 4,
        color: 'pink',
        title: '휴식',
        amount: 900,
        unit: '분',
      },
    ],
  },
  {
    idx: 5,
    title: '다섯번째',
    importance: 2,
    startedAt: '20:00',
    endedAt: '21:30',
    lat: 123,
    lng: 123,
    location: '집',
    public: true,
    tag_idx: 3,
    tag_name: '생존',
    content: '요즘은 뭐가 재미있지?',
    done: false,
    labels: [
      {
        idx: 4,
        color: 'pink',
        title: '휴식',
        amount: 900,
        unit: '분',
      },
    ],
  },
  {
    idx: 6,
    title: '여섯번째',
    importance: 2,
    startedAt: '20:00',
    endedAt: '21:30',
    lat: 123,
    lng: 123,
    location: '집',
    public: true,
    tag_idx: 0,
    tag_name: '부스트캠프',
    content: '요즘은 뭐가 재미있지?',
    done: false,
    labels: [
      {
        idx: 4,
        color: 'pink',
        title: '휴식',
        amount: 900,
        unit: '분',
      },
    ],
  },
];