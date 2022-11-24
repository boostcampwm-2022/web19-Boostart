declare module 'GlobalType' {
  interface FriendsList {
    idx: number;
    userId: string;
    username: string;
    profileImg: string;
  }

  interface LabelData {
    idx: number;
    title: string;
    color: string;
    amount: number;
    unit: string;
  }

  interface Task {
    idx: number;
    title: string;
    importance: number;
    startedAt: string;
    endedAt: string;
    lat: number;
    lng: number;
    location: string;
    isPublic: boolean;
    tag_idx: number;
    tag_name: string;
    content: string;
    done: boolean;
    labels: LabelData[];
  }

  interface Tag {
    idx: number;
    title: string;
    color: string;
  }

  interface CompletionCheckBoxStatus {
    complete: boolean;
    incomplete: boolean;
  }

  interface Shape {
    type: string;
    height?: number;
    width?: number;
    radius?: number;
    rx?: number;
    ry?: number;
    fill: string;
    top: number;
    left: number;
    angle: number;
    scaleX: number;
    scaleY: number;
  }
}
