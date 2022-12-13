import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { myInfo, visitState } from '../common/atoms';
import useCurrentDate from '../../hooks/useCurrentDate';
import globalSocket from '../common/Socket';
import { DEFAULT_OBJECT_VALUE } from '../../constants';
import { Shape, FabricText, FabricLine, ShapeType, FabricObject, ObjectData, Friend } from 'GlobalType';
import { fabric } from 'fabric';
import { v4 } from 'uuid';
import styled from 'styled-components';

interface CanvasProps {
  setAuthorList: React.Dispatch<Friend[]>;
  setOnlineList: React.Dispatch<number[]>;
}

const Canvas = ({ setAuthorList, setOnlineList }: CanvasProps) => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const colorRef = useRef<HTMLInputElement | null>(null);
  const myProfile = useRecoilValue(myInfo);
  const currentVisit = useRecoilValue(visitState);
  const { currentDate, dateToString } = useCurrentDate();
  const [isJoined, setIsJoined] = useState(false);
  const canvasBackground = '/canvasBackground.png';
  const diaryObjects = new Map();
  const socket = globalSocket.instance;

  const initCanvas = (): fabric.Canvas => {
    const canvas = new fabric.Canvas('canvas', {
      height: 400,
      width: 674,
      selection: false,
    });
    return canvas;
  };

  const enterDrawingMode = (brushWidth: number) => {
    if (!canvasRef.current || !colorRef.current) return;
    const brush = canvasRef.current.freeDrawingBrush;
    brush.width = brushWidth;
    brush.color = colorRef.current.value;
    canvasRef.current.isDrawingMode = true;
  };
  const leaveDrawingMode = () => {
    if (!canvasRef.current) return;
    canvasRef.current.isDrawingMode = false;
  };

  const changeBrushColor = () => {
    if (!canvasRef.current || !colorRef.current) return;
    const brush = canvasRef.current.freeDrawingBrush;
    brush.color = colorRef.current.value;
  };

  const handleKeydown = (e: KeyboardEvent) => {
    const pressedKey = e.key;
    switch (pressedKey) {
      case 'Delete':
      case 'Backspace':
        eraseSelectedObject();
        break;
      case 'Escape':
        leaveDrawingMode();
        break;
    }
  };

  const eraseSelectedObject = () => {
    if (!canvasRef.current) return;
    const currentTarget = canvasRef.current.getActiveObject() as FabricObject;
    if (!currentTarget) return;
    if (currentTarget instanceof fabric.IText && currentTarget.isEditing) return;
    canvasRef.current.remove(currentTarget);
    const objectId = currentTarget.id;
    socket.emit('sendRemovedObjectId', objectId);
  };

  // Create Objects

  const createNewShape = (type: ShapeType) => {
    if (!colorRef.current) return;
    const { rx, ry, width, height, top, left, angle, scaleX, scaleY } = DEFAULT_OBJECT_VALUE;
    const shapeData = {
      type: type,
      [type === 'circle' ? 'ry' : 'height']: type === 'circle' ? ry : height,
      [type === 'circle' ? 'rx' : 'width']: type === 'circle' ? rx : width,
      top,
      left,
      fill: colorRef.current.value,
      angle,
      scaleX,
      scaleY,
      id: v4(),
    };
    dispatchCanvasChange(shapeData);
  };

  const createNewText = () => {
    if (!colorRef.current) return;
    const { text, left, top, fontSize, angle, scaleX, scaleY } = DEFAULT_OBJECT_VALUE;
    const textData = {
      type: 'text',
      text,
      left,
      top,
      fontSize,
      fill: colorRef.current.value,
      angle,
      scaleX,
      scaleY,
      id: v4(),
    };
    dispatchCanvasChange(textData);
  };

  //Draw Objects

  const drawShapeOnCanvas = (shapeData: Shape) => {
    let shape: fabric.Object | undefined;
    const shapeId = shapeData.id;
    const type = shapeData.type;

    if (type === 'rect') {
      shape = new fabric.Rect(shapeData);
    } else if (type === 'triangle') {
      shape = new fabric.Triangle(shapeData);
    } else if (type === 'circle') {
      shape = new fabric.Ellipse(shapeData);
    }

    if (!shape || !canvasRef.current) return;
    diaryObjects.set(shapeId, shape);
    canvasRef.current.add(shape);
    canvasRef.current.renderAll();
  };

  const drawTextOnCanvas = (textData: FabricText) => {
    const textId = textData.id;
    const text = new fabric.IText(textData.text, textData);
    if (!text || !canvasRef.current) return;
    diaryObjects.set(textId, text);
    canvasRef.current.add(text);
    return text;
  };

  const drawLineOnCanvas = (lineData: FabricLine) => {
    const line = new fabric.Path(lineData.path, lineData);
    const lineId = lineData.id;
    if (!line || !canvasRef.current) return;
    diaryObjects.set(lineId, line);
    canvasRef.current.add(line);
    canvasRef.current.renderAll();
  };

  //Dispatch Modified Object

  const dispatchCreatedLine = (e: any) => {
    const newId = v4();
    e.path.id = newId;
    diaryObjects.set(newId, e.path);
    const { path, left, top, stroke, fill, strokeWidth, angle, strokeLineCap, strokeLineJoin, scaleX, scaleY } = e.path;
    const lineData = {
      type: 'path',
      path,
      left,
      top,
      stroke,
      strokeWidth,
      angle,
      fill,
      scaleX,
      scaleY,
      strokeLineCap,
      strokeLineJoin,
      id: newId,
    };
    dispatchCanvasChange(lineData);
  };

  const dispatchModifiedObject = (e: any) => {
    const modifiedObject = e.target;
    const objectType = modifiedObject.type;
    if (objectType === 'path') dispatchModifiedLine(modifiedObject);
    else if (objectType === 'text') dispatchModifiedText(modifiedObject);
    else dispatchModifiedShape(modifiedObject);
  };

  const dispatchModifiedShape = (modifiedObject: any) => {
    const { type, rx, ry, width, height, top, left, fill, angle, scaleX, scaleY, id } = modifiedObject;
    const shapeData = {
      type,
      rx,
      ry,
      width,
      height,
      top,
      left,
      fill,
      angle,
      scaleX,
      scaleY,
      id,
    };
    dispatchCanvasChange(shapeData);
  };

  const dispatchModifiedText = (modifiedObject: any) => {
    const { type, text, left, top, fontSize, fill, angle, scaleX, scaleY, id } = modifiedObject;
    const textData = {
      type,
      text,
      left,
      top,
      fontSize,
      fill,
      angle,
      scaleX,
      scaleY,
      id,
    };
    dispatchCanvasChange(textData);
  };

  const dispatchModifiedLine = (modifiedObject: any) => {
    const { type, id, path, left, top, stroke, fill, strokeWidth, angle, strokeLineCap, strokeLineJoin, scaleX, scaleY } = modifiedObject;
    const lineData = {
      type,
      path,
      left,
      top,
      stroke,
      strokeWidth,
      angle,
      fill,
      scaleX,
      scaleY,
      strokeLineCap,
      strokeLineJoin,
      id,
    };
    dispatchCanvasChange(lineData);
  };

  //Update Modified Object

  const updateModifiedObject = (objectData: FabricLine | FabricText | Shape) => {
    const objectId = objectData.id;
    const objectType = objectData.type;
    const targetObject = diaryObjects.get(objectId);
    if (!canvasRef.current) return;
    canvasRef.current.remove(targetObject);
    if (objectType === 'path') drawLineOnCanvas(objectData as FabricLine);
    else if (objectType === 'text') drawTextOnCanvas(objectData as FabricText);
    else drawShapeOnCanvas(objectData as Shape);
  };

  //remove Object

  const removeObject = (objectId: string) => {
    const targetObject = diaryObjects.get(objectId);
    if (!canvasRef.current) return;
    canvasRef.current.remove(targetObject);
    diaryObjects.delete(objectId);
  };

  const dispatchCanvasChange = (objectData: FabricLine | FabricText | Shape) => {
    socket.emit('sendModifiedObject', objectData);
  };

  const joinSocketRoom = () => {
    const currentDateString = dateToString();
    if (!currentDateString || !currentVisit.userId) return;
    socket.emit('joinToNewRoom', currentVisit.userId, currentDateString);
  };

  const presentPresetObjects = (objectDataMap: ObjectData) => {
    if (!objectDataMap) return;
    Object.values(objectDataMap).forEach((objectData) => {
      updateModifiedObject(objectData);
    });
  };

  const setCanvasBackground = () => {
    fabric.Image.fromURL(canvasBackground, function (img) {
      img.set({
        top: 0,
        left: 0,
        evented: false,
      });
      img.scaleToWidth(674);
      img.setCoords();
      if (!canvasRef.current) return;
      canvasRef.current.add(img);
      joinSocketRoom();
    });
  };

  const requestInitObjects = () => {
    // socket.emit('requestCurrentObjects');
  };

  const registAuthor = () => {
    if (isJoined) {
      socket.emit('turnToOffline');
    } else if (!isJoined) {
      if (!myProfile) return;
      socket.emit('registAuthor', myProfile);
    }
    setIsJoined((isJoined) => !isJoined);
  };

  const updateAuthorList = (authorList: Friend[], onlineList: number[]) => {
    setAuthorList(authorList);
    setOnlineList(onlineList);
  };

  useEffect(() => {
    if (!canvasRef.current) canvasRef.current = initCanvas();
    setCanvasBackground();
    setIsJoined(false);
    // canvasRef.current.on('path:created', dispatchCreatedLine);
    // canvasRef.current.on('object:modified', dispatchModifiedObject);
    // socket.on('offerCurrentObjects', presentPresetObjects);
    // socket.on('updateModifiedObject', updateModifiedObject);
    // socket.on('applyObjectRemoving', removeObject);
    // socket.on('initReady', requestInitObjects);
    // socket.on('updateAuthorList', updateAuthorList);
    // window.addEventListener('keydown', handleKeydown);

    socket.on('serverStatusChange', updateDiary);
    canvasRef.current.on('object:modified', handleObjectModified);
    socket.on('offerCurrentObjects', handleObjectsOffer);

    return () => {
      if (!canvasRef.current) return;
      // canvasRef.current.off('path:created', dispatchCreatedLine);
      // canvasRef.current.off('object:modified', dispatchModifiedObject);
      // socket.off('offerCurrentObjects', presentPresetObjects);
      // socket.off('updateModifiedObject', updateModifiedObject);
      // socket.off('applyObjectRemoving', removeObject);
      // socket.off('initReady', requestInitObjects);
      // socket.off('updateAuthorList', updateAuthorList);
      // window.removeEventListener('keydown', handleKeydown);
      // socket.emit('leaveCurrentRoom');
      // canvasRef.current.clear();

      socket.off('serverStatusChange', updateDiary);
      canvasRef.current.off('object:modified', handleObjectModified);
      socket.off('offerCurrentObjects', handleObjectsOffer);
    };
  }, [currentDate, currentVisit]);

  type FabricType = 'Rect' | 'Triangle' | 'Ellipse' | 'IText' | 'Path';
  interface FabricData {
    id?: string;
    type: FabricType;
    width: number;
    height: number;
    top: number;
    left: number;
    fill: string;
    angle: number;
    scaleX: number;
    scaleY: number;
    rx?: number;
    ry?: number;
    text?: string;
    fontSize?: number;
    path?: any;
    stroke?: any;
    strokeWidth?: number;
  }

  const createFabricObject = (fabricData: FabricData) => {
    const { type } = fabricData;
    let object;
    switch (type) {
      case 'Rect':
      case 'Triangle':
      case 'Ellipse': {
        object = new fabric[type](fabricData);
        break;
      }
      case 'IText': {
        object = new fabric[type](fabricData.text!, fabricData);
        break;
      }
      case 'Path': {
        object = new fabric[type](fabricData.path, fabricData);
        break;
      }
    }

    return object;
  };

  const updateDiary = (fabricData: FabricData) => {
    if (!canvasRef.current) {
      console.log('error');
      return;
    }

    const { id } = fabricData;

    const object = createFabricObject(fabricData);

    const oldObject = diaryObjects.get(id);
    diaryObjects.set(id, object);

    canvasRef.current.add(object);
    canvasRef.current.remove(oldObject);
  };

  const putObject = ({ id, type, width, height, top, left, fill, angle, scaleX, scaleY, rx, ry, text, fontSize, path, stroke, strokeWidth }: FabricData) => {
    const fabricData = { id, type, width, height, top, left, fill, angle, scaleX, scaleY, rx, ry, text, fontSize, path, stroke, strokeWidth };

    if (type !== 'Ellipse') {
      delete fabricData.rx;
      delete fabricData.ry;
    }

    if (type !== 'IText') {
      delete fabricData.text;
      delete fabricData.fontSize;
    }

    if (type !== 'Path') {
      delete fabricData.path;
      delete fabricData.stroke;
      delete fabricData.strokeWidth;
    }

    socket.emit('clientStatusChange', fabricData);
  };

  const generateDefaultFabricData = (type: FabricType, fill: string) => {
    return { ...DEFAULT_OBJECT_VALUE, type, fill };
  };

  const handleObjectModified = (e: any) => {
    const modifiedObject = e.target;
    if (!canvasRef.current) {
      console.log('error');
      return;
    }
    putObject(modifiedObject);
  };

  const handleObjectsOffer = (fabricObjects: any) => {
    console.log(fabricObjects);
    Object.entries(fabricObjects).forEach(([id, fabricData]: any) => {
      const fabricObject: any = createFabricObject(fabricData);
      // console.log('1', fabricObject);
      // console.log('2', diaryObjects.get(fabricObject.id));
      updateDiary(fabricData);
    });

    console.log(diaryObjects);
  };

  return (
    <>
      <ForeignerScreen isActive={isJoined}></ForeignerScreen>
      <canvas id="canvas" />
      <ControlBar>
        <Palette isActive={isJoined}>
          <button onClick={() => putObject(generateDefaultFabricData('Ellipse', '#000000'))}>foo</button>
          <span onClick={() => enterDrawingMode(3)}>연필</span>
          <span onClick={() => enterDrawingMode(10)}>형광펜</span>
          <span onClick={() => enterDrawingMode(20)}>브러쉬</span>
          <img src="/rect.svg" onClick={() => createNewShape('rect')} alt="" />
          <img src="/triangle.svg" onClick={() => createNewShape('triangle')} alt="" />
          <img src="/circle.svg" onClick={() => createNewShape('circle')} alt="" />
          <img src="/textIcon.svg" onClick={() => createNewText()} alt="" />
          <input type="color" ref={colorRef} onChange={changeBrushColor} />
        </Palette>
        <JoinButton onClick={() => registAuthor()}>{isJoined ? 'DRAW' : 'JOIN'}</JoinButton>
      </ControlBar>
    </>
  );
};

export default Canvas;

const ControlBar = styled.div`
  width: 100%;
  height: 3rem;
  margin-top: 0.5rem;
  display: flex;
  position: relative;
`;
const ForeignerScreen = styled.div<{
  isActive: boolean;
}>`
  width: 100%;
  height: 26rem;
  position: absolute;
  top: 3.5rem;
  left: 0;
  background: rgba(0, 0, 0, 0);
  z-index: 500;
  display: ${(props) => (props.isActive ? 'none' : 'block')};
`;

const Palette = styled.div<{
  isActive: boolean;
}>`
  width: ${(props) => (props.isActive ? '28rem' : '1px')};
  height: 3rem;
  padding: ${(props) => (props.isActive ? '0 1rem 0 4rem' : '0')};
  border-radius: 2rem;
  background: var(--color-gray1);
  position: absolute;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
  top: 0;
  left: 3rem;
  overflow: hidden;
  box-sizing: border-box;
  transition: all 0.5s;
  & img {
    height: 1.5rem;
  }
  & span {
    white-space: nowrap;
  }
`;
const JoinButton = styled.div`
  width: 6.5rem;
  height: 3rem;
  position: absolute;
  border-radius: 2rem;
  color: white;
  background: var(--color-main);
  font-size: 1rem;
  font-family: 'Press Start 2P', cursive;
  text-align: center;
  line-height: 3rem;
`;
