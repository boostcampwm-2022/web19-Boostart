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
  setAuthorList: React.Dispatch<any>;
}

const Canvas = ({ setAuthorList }: CanvasProps) => {
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
    const canvas = new fabric.Canvas('canvas', { height: 400, width: 674, selection: false });
    return canvas;
  };

  const enterDrawingMode = (brushWidth: number) => {
    if (!canvasRef.current || !colorRef.current) return;
    const brush = canvasRef.current.freeDrawingBrush;
    brush.width = brushWidth;
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
        const selectedObject = canvasRef.current?.getActiveObject();
        eraseSelectedObject(selectedObject);
        break;
      case 'Escape':
        leaveDrawingMode();
        break;
    }
  };

  const eraseSelectedObject = (fabricObject: any) => {
    if (!fabricObject) return;
    if (fabricObject instanceof fabric.IText && fabricObject.isEditing) return;
    const { id } = fabricObject;
    socket.emit('deleteObject', id);
  };

  const joinSocketRoom = () => {
    const currentDateString = dateToString();
    if (!currentDateString || !currentVisit.userId) return;
    socket.emit('joinToNewRoom', currentVisit.userId, currentDateString);
  };

  const setCanvasBackground = () => {
    fabric.Image.fromURL(canvasBackground, function (img) {
      img.set({ top: 0, left: 0, evented: false });
      img.scaleToWidth(674);
      img.setCoords();
      if (!canvasRef.current) return;
      canvasRef.current.add(img);
    });
  };

  const handleNewEditorEvent = (user: any) => {
    setAuthorList((authorList: any) => {
      const newEditor = authorList.find((_user: any) => _user.userIdx === user.userIdx);
      if (newEditor === undefined) {
        user.isOnline = true;
        authorList.push(user);
      } else {
        newEditor.isOnline = true;
      }
      return [...authorList];
    });
  };

  const handleEditorLeft = (userIdx: number) => {
    setAuthorList((authorList: any) => {
      const leftUser = authorList.find((user: any) => user.userIdx === userIdx);
      leftUser.isOnline = false;
      return [...authorList];
    });
  };

  const registAuthor = () => {
    if (isJoined) {
      socket.emit('leaveEditing');
    } else {
      socket.emit('joinEditing');
    }
    setIsJoined((isJoined) => !isJoined);
  };

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

  const generateDefaultFabricData = (type: FabricType) => {
    return { ...DEFAULT_OBJECT_VALUE, type, fill: colorRef.current?.value ?? '#000000' };
  };

  const handleObjectModified = (e: any) => {
    const modifiedObject = e.target;
    putObject(modifiedObject);
  };

  const handleObjectsOffer = ({ objects, participants }: any) => {
    setAuthorList(participants);

    Object.values(objects).forEach((fabricData: any) => {
      updateDiary(fabricData);
    });
  };

  const handlePathCreated = (e: any) => {
    const fabricObject = e.path;
    fabricObject.type = 'Path';
    putObject(fabricObject);
  };

  const handleObjectDeleted = (id: string) => {
    const oldObject = diaryObjects.get(id);
    canvasRef.current?.remove(oldObject);
  };

  useEffect(() => {
    if (!currentVisit || !currentDate) return;
    if (!canvasRef.current) {
      canvasRef.current = initCanvas();
      setCanvasBackground();
    } else {
      joinSocketRoom();
      setIsJoined(false);

      window.addEventListener('keydown', handleKeydown);
      socket.on('serverStatusChange', updateDiary);
      canvasRef.current.on('path:created', handlePathCreated);
      canvasRef.current.on('object:modified', handleObjectModified);
      socket.on('offerCurrentObjects', handleObjectsOffer);
      socket.on('objectDeleted', handleObjectDeleted);
      socket.on('newEditor', handleNewEditorEvent);
      socket.on('editorLeft', handleEditorLeft);
    }

    return () => {
      if (!canvasRef.current) return;
      window.removeEventListener('keydown', handleKeydown);
      socket.off('serverStatusChange', updateDiary);
      canvasRef.current.off('path:created', handlePathCreated);
      canvasRef.current.off('object:modified', handleObjectModified);
      socket.off('offerCurrentObjects', handleObjectsOffer);
      socket.off('objectDeleted', handleObjectDeleted);
      socket.off('newEditor', handleNewEditorEvent);
      socket.off('editorLeft', handleEditorLeft);
      socket.emit('leaveCurrentRoom');
    };
  }, [currentDate, currentVisit]);

  return (
    <>
      <ForeignerScreen isActive={isJoined}></ForeignerScreen>
      <canvas id="canvas" />
      <ControlBar>
        <Palette isActive={isJoined}>
          <button onClick={() => putObject(generateDefaultFabricData('Ellipse'))}>foo</button>
          <span onClick={() => enterDrawingMode(3)}>연필</span>
          <span onClick={() => enterDrawingMode(10)}>형광펜</span>
          <span onClick={() => enterDrawingMode(20)}>브러쉬</span>
          <img src="/rect.svg" onClick={() => putObject(generateDefaultFabricData('Rect'))} alt="" />
          <img src="/triangle.svg" onClick={() => putObject(generateDefaultFabricData('Triangle'))} alt="" />
          <img src="/circle.svg" onClick={() => putObject(generateDefaultFabricData('Ellipse'))} alt="" />
          <img src="/textIcon.svg" onClick={() => putObject(generateDefaultFabricData('IText'))} alt="" />
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
const ForeignerScreen = styled.div<{ isActive: boolean }>`
  width: 100%;
  height: 26rem;
  position: absolute;
  top: 3.5rem;
  left: 0;
  background: rgba(0, 0, 0, 0);
  z-index: 500;
  display: ${(props) => (props.isActive ? 'none' : 'block')};
`;

const Palette = styled.div<{ isActive: boolean }>`
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
