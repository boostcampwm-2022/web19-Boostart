import { useEffect, useRef, useState } from 'react';
import globalSocket from '../common/Socket';
import { Shape, FabricText, FabricLine } from 'GlobalType';
import { fabric } from 'fabric';
import { v4 } from 'uuid';

const Canvas = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const colorRef = useRef<HTMLInputElement | null>(null);
  const canvasBackground = '/canvasBackground.png';

  const initCanvas = () => {
    const canvas = new fabric.Canvas('canvas', {
      height: 400,
      width: 680,
      backgroundImage: canvasBackground,
      selection: false,
    });
    return canvas;
  };

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

  const drawShapeOnCanvas = (shapeData: Shape) => {
    let shape: fabric.Object | undefined;
    const type = shapeData.type;

    if (type === 'rect') {
      shape = new fabric.Rect(shapeData);
    } else if (type === 'triangle') {
      shape = new fabric.Triangle(shapeData);
    } else if (type === 'circle') {
      shape = new fabric.Ellipse(shapeData);
    }

    if (!shape || !canvasRef.current) return;
    canvasRef.current.add(shape);
    canvasRef.current.renderAll();
    console.log(canvasRef.current.getObjects());
  };

  const createNewText = () => {
    if (!colorRef.current) return;
    const textData = {
      type: 'text',
      content: '텍스트를 입력하세요',
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
    drawTextOnCanvas(textData);
  };
  const drawTextOnCanvas = (textData: FabricText) => {
    console.log('draw');
    const text = new fabric.IText(textData.content, textData);
    if (!text || !canvasRef.current) return;
    canvasRef.current.add(text);
    canvasRef.current.setActiveObject(text);
    text.enterEditing();
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
    canvasRef.current.remove(canvasRef.current.getActiveObject());
  };
  const leaveDrawingMode = (e: any) => {
    console.log(e);
    if (!canvasRef.current) return;
    canvasRef.current.isDrawingMode = false;
  };

  const dispatchCreatedLine = (e: any) => {
    const { path, left, top, stroke, fill, strokeWidth, angle, strokeLineCap, strokeLineJoin, zoomX, zoomY } = e.path;
    const lineData = {
      type: 'path',
      path,
      left,
      top,
      stroke,
      strokeWidth,
      angle,
      fill,
      zoomX,
      zoomY,
      strokeLineCap,
      strokeLineJoin,
      id: v4(),
    };
    sendLine(lineData);
  };

  const drawLineOnCanvas = (lineData: FabricLine) => {
    const text = new fabric.Path(lineData.path, lineData);
    console.log(text);
    if (!text || !canvasRef.current) return;
    canvasRef.current.add(text);
    canvasRef.current.renderAll();
  };

  const sendShape = (shape: Shape) => {
    globalSocket.emit('sendCreatedShape', shape, globalSocket.id);
  };
  const sendText = (textData: FabricText) => {
    globalSocket.emit('sendCreatedText', textData, globalSocket.id);
  };
  const sendLine = (lineData: FabricLine) => {
    globalSocket.emit('sendCreatedLine', lineData, globalSocket.id);
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

  useEffect(() => {
    if (!canvasRef.current) canvasRef.current = initCanvas();
    canvasRef.current.on('path:created', leaveDrawingMode);
    canvasRef.current.on('path:created', dispatchCreatedLine);
    canvasRef.current.on('object:modified', (e: any) => console.log(e.target?.id));
    window.addEventListener('keydown', eraseSelectedObject);

    return () => {
      if (!canvasRef.current) return;
      canvasRef.current.off('path:created', leaveDrawingMode);
      canvasRef.current.off('path:created', dispatchCreatedLine);
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
