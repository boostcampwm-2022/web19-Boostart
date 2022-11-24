import React, { useState, useEffect, useRef } from 'react';
import DateSelector from './DateSelector';
import TaskList from './TaskItem';
import { Task, CompletionCheckBoxStatus } from 'GlobalType';
import { dummyTaskList } from '../common/dummy';
import * as S from './Log.style';

const Log = () => {
  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState<number[]>([0, 0]);
  const [taskList, setTaskList] = useState<Task[]>(dummyTaskList);
  const [activeTask, setActiveTag] = useState<number | null>(null);
  const [timeMarkerData, setTimeMarkerData] = useState<number[]>([0, 0]);
  const [completionCheckBoxStatus, setCompletionCheckBoxStatus] = useState<CompletionCheckBoxStatus>({ complete: true, incomplete: true });
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

  const filteredTasks = (tag: string): Task[] => getFilteredTaskListbyTagName(tag);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!(e.target instanceof HTMLDivElement)) return;
    const target = e.target;
    if (!target.dataset.idx) return;
    mouseOffsetRef.current = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
    setMousePosition([e.pageX - mouseOffsetRef.current[0], e.pageY - mouseOffsetRef.current[1]]);
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
    if (activeTaskIdx === undefined || parseInt(activeTaskIdx) === activeTask) {
      setActiveTag(null);
      setTimeMarkerData([0, 0]);
    } else {
      const activeIdx = parseInt(activeTaskIdx);
      const startedTime = TaskMap.get(activeIdx).startedAt;
      const endedTime = TaskMap.get(activeIdx).endedAt;
      setActiveTag(activeIdx);
      calculateTime(startedTime, endedTime);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (selectedElement === null) return;

    if (!(e.target instanceof HTMLDivElement)) return;
    const target = e.target;
    setMousePosition([e.pageX - mouseOffsetRef.current[0], e.pageY - mouseOffsetRef.current[1]]);
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

  const handleCheckBoxChange = (e: React.ChangeEvent, type: string) => {
    if (!(e.target instanceof HTMLInputElement)) return;
    const isChecked = e.target.checked;
    setCompletionCheckBoxStatus({ ...completionCheckBoxStatus, [type]: isChecked });
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
        <S.SelectedItem x={mousePosition[0]} y={mousePosition[1]}>
          <span>{TaskMap.get(selectedElement).startedAt}</span> {TaskMap.get(selectedElement).title}
        </S.SelectedItem>
      )}
      <S.LogTitle>LOG</S.LogTitle>
      <S.LogContainer>
        <S.TimeBarSection>
          <img src="./timebar-clock.svg" alt="TimeBar" />
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
          <DateSelector />
          <S.CheckBoxContainer>
            <S.CheckBoxLabel htmlFor="complete">완료</S.CheckBoxLabel>
            <S.CheckBox type="checkbox" id="complete" defaultChecked={completionCheckBoxStatus.complete} onChange={(e) => handleCheckBoxChange(e, 'complete')} />
            <S.CheckBoxLabel htmlFor="incomplete">미완료</S.CheckBoxLabel>
            <S.CheckBox type="checkbox" id="incomplete" defaultChecked={completionCheckBoxStatus.incomplete} onChange={(e) => handleCheckBoxChange(e, 'incomplete')} />
          </S.CheckBoxContainer>
        </S.LogNavBarSection>
        <S.LogMainSection ref={taskContainerRef}>
          <S.SlideObserver data-direction="left" direction="left"></S.SlideObserver>
          {tagList.map((tag) => {
            return (
              <S.TagWrap key={tag} data-tag={tag} onClick={handleTagWrapClick} onMouseDown={handleMouseDown}>
                <S.TagTitle data-tag={tag}>#{tag}</S.TagTitle>
                <TaskList taskList={filteredTasks(tag)} activeTask={activeTask} completionFilter={completionCheckBoxStatus} />
              </S.TagWrap>
            );
          })}
          <S.SlideObserver data-direction="right" direction="right"></S.SlideObserver>
        </S.LogMainSection>
      </S.LogContainer>
    </>
  );
};

export default Log;
