declare module 'GlobalType' {
  export interface FriendsList {
    idx: number;
    userId: string;
    username: string;
    profileImg: string;
  }
  export interface CurrentDate {
    year: number;
    month: number;
  }

  interface LabelData {
    idx: number;
    title: string;
    color: string;
    amount: number;
    unit: string;
  }

  export interface Tasks {
    idx: number;
    title: string;
    importance: number;
    startedAt: string;
    endedAt: string;
    lat: number;
    lng: number;
    public: boolean;
    tag_idx: number;
    tag_name: string;
    content: string;
    done: boolean;
    labels: LabelData[];
  }
}
