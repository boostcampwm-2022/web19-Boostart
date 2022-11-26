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
    count: number;
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
    id: string;
  }
  interface FabricText {
    type: string;
    text: string;
    left: number;
    top: number;
    fontSize: number;
    fill: string;
    angle: number;
    scaleX: number;
    scaleY: number;
    id: string;
  }
  interface FabricLine {
    type: string;
    path: Point[] | undefined;
    left: number | undefined;
    top: number | undefined;
    fill: string | Pattern | undefined;
    stroke: string | undefined;
    strokeWidth: number | undefined;
    angle: number | undefined;
    scaleX: number | undefined;
    scaleY: number | undefined;
    strokeLineCap: string | undefined;
    strokeLineJoin: string | undefined;
    id: string;
  }
  interface DiaryObjects {
    [key: string]: fabric.Rect | fabric.Triangle | fabric.Ellipse | fabric.IText | fabric.Path;
  }

  interface Location {
    location: string;
    lat: number;
    lng: number;
  }
  type ShapeType = 'rect' | 'triangle' | 'circle';
  interface ObjectData {
    [key: string]: FabricLine | FabricText | Shape;
  }
}

interface ModalProps {
  component: JSX.Element;
  zIndex: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  transform?: string;
  handleDimmedClick: React.MouseEventHandler;
}
