import { useEffect, useRef, useState } from 'react';
import globalSocket from '../common/Socket';
import { fabric } from 'fabric';
import { Socket } from 'socket.io-client/build/esm/socket';

const Canvas = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const colorRef = useRef<HTMLInputElement | null>(null);
  const canvasBackground = '/canvasBackground.png';

  const initCanvas = () => {
    const canvas = new fabric.Canvas('canvas', {
      height: 400,
      width: 680,
      backgroundImage: canvasBackground,
    });
    return canvas;
  };

  const createShapeOnCanvas = (type: string) => {
    if (!colorRef.current) return;
    const shapeData = {
      type: type,
      [type === 'circle' ? 'ry' : 'height']: 100,
      [type === 'circle' ? 'rx' : 'width']: 100,
      top: 10,
      left: 10,
      fill: colorRef.current.value,
      angle: 0,
      scaleX: 1,
      scaleY: 1,
      id: 'asef',
    };
    let shape: fabric.Object | undefined;

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
  };

  const createTextOnCanvas = () => {
    if (!colorRef.current) return;
    const text = new fabric.IText('텍스트를 입력하세요', {
      left: 10,
      top: 10,
      fontSize: 24,
      fill: colorRef.current.value,
    });
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
  const leaveDrawingMode = () => {
    if (!canvasRef.current) return;
    canvasRef.current.isDrawingMode = false;
  };

  const sendShape = (e: any) => {
    const shape = e.target;
    console.log(e);
    globalSocket.emit('sendShape', shape);
  };

  useEffect(() => {
    setSocket(globalSocket);
    if (!canvasRef.current) canvasRef.current = initCanvas();
    canvasRef.current.on('object:added', leaveDrawingMode);
    canvasRef.current.on('object:modified', sendShape);
    window.addEventListener('keydown', eraseSelectedObject);

    return () => {
      if (!canvasRef.current) return;
      canvasRef.current.off('object:added', leaveDrawingMode);
      canvasRef.current.off('object:modified', sendShape);
      window.removeEventListener('keydown', eraseSelectedObject);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('dispatchShape', (shape) => {
        console.log(shape);
      });
    }
    return () => {
      if (socket) socket.disconnect();
    };
  });

  return (
    <>
      <canvas id="canvas" />
      <span onClick={() => enterDrawingMode(3)}>연필</span>
      <span onClick={() => enterDrawingMode(10)}>형광펜</span>
      <span onClick={() => enterDrawingMode(20)}>브러쉬</span>
      <img src="/rect.svg" onClick={() => createShapeOnCanvas('rect')} />
      <img src="/triangle.svg" onClick={() => createShapeOnCanvas('triangle')} />
      <img src="/circle.svg" onClick={() => createShapeOnCanvas('circle')} />
      <img src="/textIcon.svg" onClick={() => createTextOnCanvas()} />
      <input type="color" ref={colorRef} />
    </>
  );
};

export default Canvas;
