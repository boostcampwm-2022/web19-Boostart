import { useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import globalSocket from '../common/Socket';
import { DEFAULT_OBJECT_VALUE } from '../../constants';
import { Shape, FabricText, FabricLine, ShapeType, FabricObject } from 'GlobalType';
import { fabric } from 'fabric';
import { v4 } from 'uuid';
import { visitState } from '../common/atoms';

const Canvas = () => {
  const currentVisit = useRecoilValue(visitState);
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const colorRef = useRef<HTMLInputElement | null>(null);
  const canvasBackground = '/canvasBackground.png';
  const diaryObjects = new Map();

  const initCanvas = (): fabric.Canvas => {
    const canvas = new fabric.Canvas('canvas', {
      height: 400,
      width: 680,
      backgroundImage: canvasBackground,
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
    globalSocket.emit('sendRemovedObjectId', objectId);
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
    drawShapeOnCanvas(shapeData);
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
    const fabricText = drawTextOnCanvas(textData);
    if (!fabricText || !canvasRef.current) return;
    canvasRef.current.setActiveObject(fabricText);
    fabricText.enterEditing();
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
    globalSocket.emit('sendModifiedObject', objectData);
  };

  globalSocket.on('updateModifiedObject', (objectData) => {
    updateModifiedObject(objectData);
  });
  globalSocket.on('applyObjectRemoving', (objectId) => {
    removeObject(objectId);
  });
  globalSocket.on('offerCurrentObjects', (objectdataMap) => {
    Object.values(objectdataMap).forEach((objectData) => {
      updateModifiedObject(objectData);
    });
  });

  useEffect(() => {
    if (!canvasRef.current) canvasRef.current = initCanvas();
    canvasRef.current.on('path:created', dispatchCreatedLine);
    canvasRef.current.on('object:modified', dispatchModifiedObject);
    canvasRef.current.on('object:moving', dispatchModifiedObject);
    window.addEventListener('keydown', handleKeydown);
    globalSocket.emit('requestCurrentObjects');

    return () => {
      if (!canvasRef.current) return;
      canvasRef.current.off('path:created', dispatchCreatedLine);
      canvasRef.current.off('object:modified', dispatchModifiedObject);
      canvasRef.current.off('object:moving', dispatchModifiedObject);
      window.removeEventListener('keydown', handleKeydown);
      canvasRef.current.clear();
    };
  });

  return (
    <>
      <canvas id="canvas" />
      <span onClick={() => enterDrawingMode(3)}>연필</span>
      <span onClick={() => enterDrawingMode(10)}>형광펜</span>
      <span onClick={() => enterDrawingMode(20)}>브러쉬</span>
      <img src="/rect.svg" onClick={() => createNewShape('rect')} alt="" />
      <img src="/triangle.svg" onClick={() => createNewShape('triangle')} alt="" />
      <img src="/circle.svg" onClick={() => createNewShape('circle')} alt="" />
      <img src="/textIcon.svg" onClick={() => createNewText()} alt="" />
      <input type="color" ref={colorRef} onChange={changeBrushColor} />
    </>
  );
};

export default Canvas;
