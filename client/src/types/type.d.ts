declare module 'GlobalType' {
  interface Friend {
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
    tagIdx: number;
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

  interface Label {
    idx: number;
    title: string;
    color: string;
    unit: string;
    count: number?;
    amount: number?;
  }

  type ShapeType = 'rect' | 'triangle' | 'circle';
  interface ObjectData {
    [key: string]: FabricLine | FabricText | Shape;
  }

  interface FabricObject extends fabric.Object {
    id: string;
  }
}

type FreindRequestAction = 'accept' | 'deny';

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
