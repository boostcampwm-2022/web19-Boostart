import axios from 'axios';
import { Task, CompletionCheckBoxStatus, Emoticon } from 'GlobalType';
import { useEffect, useState } from 'react';
import { HOST } from '../../constants';
import * as S from './Log.style';
import { visitState } from '../common/atoms';
import { useRecoilState } from 'recoil';
import TaskModal from '../TaskModal/TaskModal';

interface taskListProps {
  taskList: Task[];
  activeTask: number | null;
  completionFilter: CompletionCheckBoxStatus;
  fetchTaskList: () => Promise<void>;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaskList = ({ taskList, activeTask, completionFilter, fetchTaskList, setIsEditModalOpen }: taskListProps) => {
  const [currentVisit, setCurrentVisit] = useRecoilState(visitState);

  const isTaskFiltered = (done: boolean) => {
    if (done && !completionFilter.complete) return true;
    else if (!done && !completionFilter.incomplete) return true;
    return false;
  };

  const patchTaskDone = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const taskIdx = e.target.dataset.idx;
    try {
      const response = await axios.patch(`${HOST}/api/v1/task/status/${taskIdx}`, { done: e.target.checked });
      fetchTaskList();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (taskIdx: number) => {
    if (window.confirm('일정을 삭제하시겠습니까?')) {
      try {
        const a = await axios.delete(`${HOST}/api/v1/task/${taskIdx}`);
        fetchTaskList();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const CalcHeight = (task: Task) => {
    let count = 0;
    if (task.location) count++;
    if (task.content && task.content !== '') count += 4.6; // 2.3;
    if (task.labels.length !== 0) count += Math.ceil(task.labels.length / 2) * 1.5 + 0.8;
    if (!currentVisit.isMe) count = count - 2;
    return count;
  };

  const taskChange = (task: Task) => {
    setIsEditModalOpen(true);
    //modal...
  };
  const DetailInfo = ({ task }: { task: Task }) => {
    return (
      <>
        <hr />
        <S.TaskDetailInfos>
          <S.TaskDetailInfosCol>
            <S.TimeIcon />
            {task.startedAt} ~ {task.endedAt}
          </S.TaskDetailInfosCol>
          <S.TaskDetailInfosCol>
            <S.ImportanceIcon />
            {[1, 2, 3, 4, 5].map((d, index) => d <= task.importance && <div key={index}>{'⭐️ '}</div>)}
          </S.TaskDetailInfosCol>
          {task.location && (
            <S.TaskDetailInfosCol>
              <S.LocationIcon />
              {task.location}
            </S.TaskDetailInfosCol>
          )}
        </S.TaskDetailInfos>
        {task.content && (
          <>
            <hr />
            <S.TaskDetailInfos>
              <S.TaskDetailInfosCol height={'3.5rem'}>{task.content}</S.TaskDetailInfosCol>
            </S.TaskDetailInfos>
          </>
        )}
        {task.labels.length !== 0 && (
          <>
            <hr />
            <S.TaskDetailInfos flex="row">
              {task.labels.map((label) => {
                return (
                  <S.LabelListItem key={label.labelIdx} color={label.color}>
                    {label.title} {label.amount} {label.unit}
                  </S.LabelListItem>
                );
              })}
            </S.TaskDetailInfos>
          </>
        )}

        {currentVisit.isMe && (
          <>
            <hr />

            <S.TaskDetailInfos>
              <S.TaskDetailInfosCol height="1.3rem">
                <S.TaskDetailIcon htmlFor="done">
                  <S.CheckBox type="checkbox" id="done" data-idx={task.idx} defaultChecked={task.done} onChange={patchTaskDone} />
                  완료
                </S.TaskDetailIcon>

                <S.TaskDetailIcon onClick={(e) => taskChange(task)}>
                  <S.EditIcon />
                  수정
                </S.TaskDetailIcon>
                <S.TaskDetailIcon onClick={(e) => deleteTask(task.idx)}>
                  <S.DeleteIcon />
                  삭제
                </S.TaskDetailIcon>
              </S.TaskDetailInfosCol>
            </S.TaskDetailInfos>
          </>
        )}
      </>
    );
  };

  return (
    // tagIdx, idx, title, startedAt, endedAt, importance, location, content, done, isPublic, tagName, labels
    <>
      {taskList.map((task: Task) => {
        return (
          !isTaskFiltered(task.done) && (
            <div key={task.idx}>
              <S.TaskItem key={'task' + task.idx} data-idx={task.idx} data-tag={task.tagIdx} data-active={task.idx === activeTask} done={Number(task.done)} cols={CalcHeight(task)}>
                <S.TaskMainInfos>
                  <S.TaskTime>{task.startedAt}</S.TaskTime>
                  <S.TaskTitle>{task.title}</S.TaskTitle>
                  {!task.isPublic && <S.LockerImage src="/lock.svg" />}
                </S.TaskMainInfos>
                {task.idx === activeTask && <DetailInfo task={task} />}
              </S.TaskItem>
              {task.idx === activeTask && <EmoticonList key={task.idx} task={task} isMe={currentVisit.isMe} />}
            </div>
          )
        );
      })}
    </>
  );
};

const EmoticonList = ({ task, isMe }: { task: Task; isMe: boolean }) => {
  const [emoticonList, setEmoticonList] = useState<Emoticon[]>([]);
  const [emoticonSet, setEmoticonSet] = useState<Emoticon[]>([]);

  useEffect(() => {
    getEmoticon();
  }, []);

  const getEmoticon = async () => {
    try {
      const result = await axios.get(`${HOST}/api/v1/emoticon/task/${task.idx}`);
      setEmoticonList(result.data);
      setEmoticonSet(
        result.data.filter((element: Emoticon, index: any) => {
          return result.data.findIndex((el: Emoticon) => el.emoticon == element.emoticon) === index;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const emoticonSample = ['🙂', '❤️', '😭', '👍', '👎', '🔥', '🎉'];

  const postEmoticon = async (index: number) => {
    try {
      const response = await axios.put(`${HOST}/api/v1/emoticon/task/${task.idx}`, { emoticon: index + 1 });
      getEmoticon();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {!isMe && (
        <S.EmoticonInput>
          {emoticonSample.map((el, index) => (
            <span key={index} onClick={(e) => postEmoticon(index)}>
              {el}
            </span>
          ))}
        </S.EmoticonInput>
      )}
      <S.EmoticonContainer>
        {emoticonSet.map((i, index) => (
          <div key={i.idx}>
            {emoticonList.filter((el) => el.emoticon === i.emoticon).length > 1 && <S.Count> {emoticonList.filter((el) => el.emoticon === i.emoticon).length} </S.Count>}
            <S.Emoticon
              authorName={`${emoticonList
                .filter((el) => el.emoticon === i.emoticon)
                .map((el_) => el_.authorName)
                .join(',')}`}
              index={index}
            >
              {i.emoticon}
            </S.Emoticon>
          </div>
        ))}
      </S.EmoticonContainer>
    </>
  );
};

export default TaskList;
