import { useEffect, useRef, useState } from 'react';
import globalSocket from '../common/Socket';
import { Shape, FabricText, FabricLine } from 'GlobalType';
import { fabric } from 'fabric';
import { v4 } from 'uuid';

const Canvas = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const colorRef = useRef<HTMLInputElement | null>(null);
  const canvasBackground = '/canvasBackground.png';
  const diaryObjects = new Map();

  const initCanvas = () => {
    const canvas = new fabric.Canvas('canvas', {
      height: 400,
      width: 680,
      backgroundImage: canvasBackground,
      selection: false,
    });
    return canvas;
  };

  const enterDrawingMode = (width: number) => {
    if (!canvasRef.current || !colorRef.current) return;
    const brush = canvasRef.current.freeDrawingBrush;
    brush.width = width;
    brush.color = colorRef.current.value;
    canvasRef.current.isDrawingMode = !canvasRef.current.isDrawingMode;
  };

  const eraseSelectedObject = (e: KeyboardEvent) => {
    if (e.key !== 'Delete' || !canvasRef.current) return;
    const currentTarget = canvasRef.current.getActiveObject();
    if (!currentTarget) return;
    if (currentTarget instanceof fabric.IText) {
      if (currentTarget.isEditing) return;
    }
    canvasRef.current.remove(currentTarget);
  };

  const leaveDrawingMode = () => {
    if (!canvasRef.current) return;
    canvasRef.current.isDrawingMode = false;
  };

  // Create Objects

  const createNewShape = (type: string) => {
    if (!colorRef.current) return;
    const shapeData = {
      type: type,
      [type === 'circle' ? 'ry' : 'height']: type === 'circle' ? 50 : 100,
      [type === 'circle' ? 'rx' : 'width']: type === 'circle' ? 50 : 100,
      top: 10,
      left: 10,
      fill: colorRef.current.value,
      angle: 0,
      scaleX: 1,
      scaleY: 1,
      id: v4(),
    };
    sendShape(shapeData);
    drawShapeOnCanvas(shapeData);
  };

  const createNewText = () => {
    if (!colorRef.current) return;
    const textData = {
      type: 'text',
      text: '텍스트를 입력하세요',
      left: 10,
      top: 10,
      fontSize: 24,
      fill: colorRef.current.value,
      angle: 0,
      scaleX: 1,
      scaleY: 1,
      id: v4(),
    };
    sendText(textData);
    const text = drawTextOnCanvas(textData);
    if (!text || !canvasRef.current) return;
    canvasRef.current.setActiveObject(text);
    text.enterEditing();
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
    updateShape(shapeData);
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
    updateText(textData);
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
    updateLine(lineData);
  };

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
    sendLine(lineData);
  };

  //Update Modified Object
  const updateModifiedLine = (lineData: FabricLine) => {
    const lineId = lineData.id;
    const targetLine = diaryObjects.get(lineId);
    if (!canvasRef.current) return;
    canvasRef.current.remove(targetLine);
    drawLineOnCanvas(lineData);
  };

  const updateModifiedText = (textData: FabricText) => {
    const textId = textData.id;
    const targetText = diaryObjects.get(textId);
    if (!canvasRef.current) return;
    canvasRef.current.remove(targetText);
    drawTextOnCanvas(textData);
  };

  const updateModifiedShape = (shapeData: Shape) => {
    const shapeId = shapeData.id;
    const targetShape = diaryObjects.get(shapeId);
    if (!canvasRef.current) return;
    canvasRef.current.remove(targetShape);
    drawShapeOnCanvas(shapeData);
  };

  const sendShape = (shapeData: Shape) => {
    globalSocket.emit('sendCreatedShape', shapeData, globalSocket.id);
  };
  const sendText = (textData: FabricText) => {
    globalSocket.emit('sendCreatedText', textData, globalSocket.id);
  };
  const sendLine = (lineData: FabricLine) => {
    globalSocket.emit('sendCreatedLine', lineData, globalSocket.id);
  };
  const updateLine = (lineData: FabricLine) => {
    globalSocket.emit('sendModifiedLine', lineData, globalSocket.id);
  };
  const updateText = (textData: FabricText) => {
    globalSocket.emit('sendModifiedText', textData, globalSocket.id);
  };
  const updateShape = (shapeData: Shape) => {
    globalSocket.emit('sendModifiedShape', shapeData, globalSocket.id);
  };

  globalSocket.on('dispatchCreatedShape', (shape, senderId) => {
    if (senderId !== globalSocket.id) drawShapeOnCanvas(shape);
  });
  globalSocket.on('dispatchCreatedText', (textData, senderId) => {
    if (senderId !== globalSocket.id) drawTextOnCanvas(textData);
  });
  globalSocket.on('dispatchCreatedLine', (lineData, senderId) => {
    if (senderId !== globalSocket.id) drawLineOnCanvas(lineData);
  });
  globalSocket.on('updateModifiedLine', (lineData, senderId) => {
    if (senderId !== globalSocket.id) updateModifiedLine(lineData);
  });
  globalSocket.on('updateModifiedText', (textData, senderId) => {
    if (senderId !== globalSocket.id) updateModifiedText(textData);
  });
  globalSocket.on('updateModifiedShape', (shapeData, senderId) => {
    if (senderId !== globalSocket.id) updateModifiedShape(shapeData);
  });

  useEffect(() => {
    if (!canvasRef.current) canvasRef.current = initCanvas();
    canvasRef.current.on('path:created', leaveDrawingMode);
    canvasRef.current.on('path:created', dispatchCreatedLine);
    canvasRef.current.on('object:modified', dispatchModifiedObject);
    window.addEventListener('keydown', eraseSelectedObject);

    return () => {
      if (!canvasRef.current) return;
      canvasRef.current.off('path:created', leaveDrawingMode);
      canvasRef.current.off('path:created', dispatchCreatedLine);
      canvasRef.current.off('object:modified', dispatchModifiedObject);
      window.removeEventListener('keydown', eraseSelectedObject);
    };
  }, []);

  return (
    <>
      <canvas id="canvas" />
      <span onClick={() => enterDrawingMode(3)}>연필</span>
      <span onClick={() => enterDrawingMode(10)}>형광펜</span>
      <span onClick={() => enterDrawingMode(20)}>브러쉬</span>
      <img src="/rect.svg" onClick={() => createNewShape('rect')} />
      <img src="/triangle.svg" onClick={() => createNewShape('triangle')} />
      <img src="/circle.svg" onClick={() => createNewShape('circle')} />
      <img src="/textIcon.svg" onClick={() => createNewText()} />
      <input type="color" ref={colorRef} />
    </>
  );
};

export default Canvas;
