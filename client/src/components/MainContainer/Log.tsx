import React, { useState, useEffect, useRef } from 'react';
import DateSelector from './DateSelector';
import TaskList from './TaskItem';
import { Task, CompletionCheckBoxStatus } from 'GlobalType';
import * as S from './Log.style';
import axios from 'axios';
import { HOST } from '../../constants';
import useCurrentDate from '../../hooks/useCurrentDate';
import Modal from '../common/Modal';
import TaskModal from '../TaskModal/TaskModal';
import { useRecoilState } from 'recoil';
import { visitState } from '../common/atoms';

interface Tag {
  idx: number;
  title: string;
  color: string;
  count: number;
}

const Log = () => {
  const [selectedTask, setSelectedTask] = useState<{ idx: number; tagIdx: number } | null>(null);
  const [mousePosition, setMousePosition] = useState<number[]>([0, 0]);
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<number | null>(null);
  const [timeMarkerData, setTimeMarkerData] = useState<number[]>([0, 0]);
  const [completionCheckBoxStatus, setCompletionCheckBoxStatus] = useState<CompletionCheckBoxStatus>({ complete: true, incomplete: true });
  const selectedTaskRef = useRef<HTMLDivElement | null>(null);
  const mouseOffsetRef = useRef<number[]>([0, 0]);
  const taskContainerRef = useRef<HTMLDivElement | null>(null);
  const { currentDate } = useCurrentDate();
  const [tagList, setTagList] = useState<Tag[]>([]);

  const [currentVisit, setCurrentVisit] = useRecoilState(visitState);

  const fetch = async () => {
    await fetchTagList();
    await fetchTaskList();
  };

  const TaskMap = new Map();
  taskList.forEach((task: Task) => {
    TaskMap.set(task.idx, task);
  });

  const getFilteredTaskListbyTag = (idx: number): Task[] => {
    return taskList
      .filter(({ tagIdx }) => tagIdx === idx)
      .sort((a: Task, b: Task) => {
        return a.startedAt.slice(0, 2) !== b.startedAt.slice(0, 2) ? Number(a.startedAt!.slice(0, 2)) - Number(b.startedAt!.slice(0, 2)) : Number(a.startedAt!.slice(3, 5)) - Number(b.startedAt!.slice(3, 5));
      });
  };

  const fetchTagList = async () => {
    const response = currentVisit.isMe ? await axios.get(`${HOST}/api/v1/tag`) : await axios.get(`${HOST}/api/v1/tag/${currentVisit.userId}`);
    const tagList = response.data;
    setTagList(tagList);
  };

  const fetchTaskList = async () => {
    const date = currentDate.toLocaleDateString().split('. ').join('-').substring(0, 10);
    const response = currentVisit.isMe ? await axios.get(`${HOST}/api/v1/task?date=${date}`) : await axios.get(`${HOST}/api/v1/task/${currentVisit.userId}?date=${date}`);
    const taskList = response.data;
    setTaskList(taskList);
  };

  useEffect(() => {
    fetchTagList();
  }, [currentVisit]);

  useEffect(() => {
    fetchTaskList();
  }, [currentDate, currentVisit]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentVisit.isMe) return;
    if (!(e.target instanceof HTMLDivElement)) return;
    const target = e.target;
    if (!target.dataset.idx) return;
    mouseOffsetRef.current = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
    setMousePosition([e.pageX - mouseOffsetRef.current[0], e.pageY - mouseOffsetRef.current[1]]);
    const timeout = setTimeout(() => {
      if (target.dataset.idx) {
        setSelectedTask({ idx: Number(target.dataset.idx), tagIdx: Number(target.dataset.tag) });
        selectedTaskRef.current = target;
        selectedTaskRef.current.style.visibility = 'hidden';
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
      setActiveTask(null);
      setTimeMarkerData([0, 0]);
    } else {
      const activeIdx = parseInt(activeTaskIdx);
      const startedTime = TaskMap.get(activeIdx).startedAt;
      const endedTime = TaskMap.get(activeIdx).endedAt;
      setActiveTask(activeIdx);
      calculateTime(startedTime, endedTime);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const handleCloseButtonClick = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    fetch();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (selectedTask === null) return;

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
  const handleMouseUp = async (e: MouseEvent) => {
    if (selectedTask === null || !selectedTaskRef.current) return;

    const destinationTagIndex = Number((e.target as HTMLDivElement).dataset.tag);
    if (!destinationTagIndex) return;

    const taskIdx = selectedTask.idx;
    const sourceTagIndex = selectedTask.tagIdx;

    if (sourceTagIndex !== destinationTagIndex) {
      try {
        await axios.patch(`${HOST}/api/v1/task/status/${taskIdx}`, { tagIdx: destinationTagIndex });
        await fetchTaskList();
      } catch (error) {
        selectedTaskRef.current.style.visibility = 'visible';
      }
    } else {
      selectedTaskRef.current.style.visibility = 'visible';
    }

    setSelectedTask(null);
    selectedTaskRef.current = null;
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
      {selectedTask !== null && (
        <S.SelectedItem x={mousePosition[0]} y={mousePosition[1]}>
          <span>{TaskMap.get(selectedTask.idx).startedAt}</span> {TaskMap.get(selectedTask.idx).title}
        </S.SelectedItem>
      )}
      <S.LogTitle>
        LOG<span> {currentVisit.isMe || `~${currentVisit.userId}`}</span>
      </S.LogTitle>
      <S.LogContainer>
        <S.Grid>
          <S.TimeBarSection>
            <img src="/timebar-clock.svg" alt="TimeBar" />
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
              if (taskList.find((t) => t.tagIdx === tag.idx))
                return (
                  <S.TagWrap key={tag.idx} data-tag={tag.idx} onClick={handleTagWrapClick} onMouseDown={handleMouseDown}>
                    <S.TagTitle color={tag.color} data-tag={tag.idx}>
                      #{tag.title}
                    </S.TagTitle>
                    <TaskList taskList={getFilteredTaskListbyTag(tag.idx)} activeTask={activeTask} completionFilter={completionCheckBoxStatus} fetchTaskList={fetchTaskList} setIsEditModalOpen={setIsEditModalOpen} />
                  </S.TagWrap>
                );
            })}
            <S.SlideObserver data-direction="right" direction="right"></S.SlideObserver>
          </S.LogMainSection>
          {currentVisit.isMe && <S.NewTaskButton onClick={() => setIsModalOpen(true)} />}
          {isModalOpen && (
            <Modal
              component={<TaskModal handleCloseButtonClick={handleCloseButtonClick} tagList={tagList} fetchTagList={fetchTagList} currentTask={null} />}
              zIndex={1001}
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              handleDimmedClick={() => {}}
            />
          )}
          {isEditModalOpen && (
            <Modal
              component={<TaskModal handleCloseButtonClick={handleCloseButtonClick} tagList={tagList} fetchTagList={fetchTagList} currentTask={taskList.find((el) => el.idx === activeTask)!} />}
              zIndex={1001}
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              handleDimmedClick={() => {}}
            />
          )}
        </S.Grid>
      </S.LogContainer>
    </>
  );
};

export default Log;
