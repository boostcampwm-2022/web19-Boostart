import React, { useState, useEffect, useRef } from 'react';
import { Task } from 'GlobalType';
import { dummyTaskList } from '../../../common/dummy';
import * as S from './style';

const Log = () => {
  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<number[]>([0, 0]);
  const [taskList, setTaskList] = useState<Task[]>(dummyTaskList);
  const [activeTag, setActiveTag] = useState<number | null>(null);
  const [timeMarkerData, setTimeMarkerData] = useState<number[]>([0, 0]);
  const selectedRef = useRef<HTMLDivElement | null>(null);
  const mouseOffsetRef = useRef<number[]>([0, 0]);
  const taskContainerRef = useRef<HTMLDivElement | null>(null);

  const TaskMap = new Map();
  const tagList = ['부스트캠프', '육아', '일상', '생존', '테스트'];
  taskList.forEach((task: Task) => {
    TaskMap.set(task.idx, task);
  });

  const getFilteredTaskListbyTagName = (tag: string): Task[] => {
    return taskList.filter(({ tag_name }) => tag_name === tag);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!(e.target instanceof HTMLDivElement)) return;
    const target = e.target;
    if (!target.dataset.idx) return;
    mouseOffsetRef.current = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
    setMousePos([e.pageX - mouseOffsetRef.current[0], e.pageY - mouseOffsetRef.current[1]]);
    const timeout = setTimeout(() => {
      if (target.dataset.idx) {
        setSelectedElement(parseInt(target.dataset.idx));
        selectedRef.current = target;
        selectedRef.current.style.visibility = 'hidden';
      }
    }, 300);
    e.target.addEventListener('mouseup', () => {
      clearTimeout(timeout);
    });
    e.target.addEventListener('mouseleave', () => {
      clearTimeout(timeout);
    });
  };

  const calculateTime = (startedAt: string, endedAt: string) => {
    const [startHour, startMin] = startedAt.split(':').map((v) => parseInt(v));
    const [endHour, endMin] = endedAt.split(':').map((v) => parseInt(v));
    const startedTime = startHour + startMin / 60;
    const duration = endHour + endMin / 60 - startedTime;
    setTimeMarkerData([startedTime, duration]);
  };

  const handleTagWrapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!(e.target instanceof HTMLDivElement)) return;
    const target = e.target;
    const activeTaskIdx = target.dataset.idx;
    if (activeTaskIdx === undefined || parseInt(activeTaskIdx) === activeTag) {
      setActiveTag(null);
      setTimeMarkerData([0, 0]);
    } else {
      const activeIdx = parseInt(activeTaskIdx);
      setActiveTag(activeIdx);
      calculateTime(TaskMap.get(activeIdx).startedAt, TaskMap.get(activeIdx).endedAt);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (selectedElement === null) return;

    if (!(e.target instanceof HTMLDivElement)) return;
    const target = e.target;
    setMousePos([e.pageX - mouseOffsetRef.current[0], e.pageY - mouseOffsetRef.current[1]]);
    if (target.dataset.direction && taskContainerRef.current) {
      if (target.dataset.direction === 'left') {
        taskContainerRef.current.scrollBy(-10, 0);
      } else {
        taskContainerRef.current.scrollBy(10, 0);
      }
    }
  };
  const handleMouseUp = (e: MouseEvent) => {
    if (selectedElement === null || !selectedRef.current) return;
    let target = e.target as HTMLDivElement;
    if (target.dataset.tag) TaskMap.get(selectedElement).tag_name = target.dataset.tag;
    setTaskList([...dummyTaskList]);
    selectedRef.current.style.visibility = 'visible';

    selectedRef.current = null;
    setSelectedElement(null);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });

  return (
    <>
      {selectedElement !== null && (
        <S.SelectedItem x={mousePos[0]} y={mousePos[1]}>
          <span>{TaskMap.get(selectedElement).startedAt}</span> {TaskMap.get(selectedElement).title}
        </S.SelectedItem>
      )}
      <S.LogTitle>LOG</S.LogTitle>
      <S.LogContainer>
        <S.slideObserver data-direction="left" direction="left"></S.slideObserver>
        <S.TimeBarSection>
          <img src="./timebar-clock.svg" alt="" />
          <S.TimeBar>
            <S.TimeMarker startedAt={timeMarkerData[0]} duration={timeMarkerData[1]}></S.TimeMarker>
          </S.TimeBar>
        </S.TimeBarSection>
        <S.LogNavBarSection>
          <S.SortOptionSelect>
            <option value="tag">태그순</option>
            <option value="time">시간순</option>
            <option value="importance">중요도순</option>
          </S.SortOptionSelect>
          <S.DateController>{'< 11.12 >'}</S.DateController>
          <div></div>
        </S.LogNavBarSection>
        <S.LogMainSection ref={taskContainerRef}>
          {tagList.map((tag) => {
            return (
              <S.TagWrap key={tag} data-tag={tag} onClick={handleTagWrapClick}>
                <S.TagTitle data-tag={tag}>#{tag}</S.TagTitle>
                {getFilteredTaskListbyTagName(tag).map(({ tag_name, idx, title, startedAt, endedAt, importance, location, content }) => {
                  return (
                    <S.TaskItems key={'task' + idx} onMouseDown={handleMouseDown} data-idx={idx} data-tag={tag_name} data-active={idx === activeTag}>
                      <div>
                        <S.TagTime>{startedAt}</S.TagTime> {title}
                      </div>
                      {idx === activeTag && (
                        <>
                          <hr />
                          <div>
                            {startedAt}-{endedAt}
                          </div>
                          <div>{location}</div>
                          <div>{importance}</div>
                          <hr />
                          <div>{content}</div>
                        </>
                      )}
                    </S.TaskItems>
                  );
                })}
              </S.TagWrap>
            );
          })}
        </S.LogMainSection>
        <S.slideObserver data-direction="right" direction="right"></S.slideObserver>
      </S.LogContainer>
    </>
  );
};

export default Log;
