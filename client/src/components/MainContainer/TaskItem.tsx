import axios from 'axios';
import { Task, CompletionCheckBoxStatus } from 'GlobalType';
import { useEffect } from 'react';
import { HOST } from '../../constants';
import * as S from './Log.style';
import { visitState } from '../common/atoms';
import { useRecoilState } from 'recoil';

interface taskListProps {
  taskList: Task[];
  activeTask: number | null;
  completionFilter: CompletionCheckBoxStatus;
  fetchTaskList: () => Promise<void>;
}

const TaskList = ({ taskList, activeTask, completionFilter, fetchTaskList }: taskListProps) => {
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
      const a = await axios.patch(`${HOST}/api/v1/task/status/${taskIdx}`, { done: e.target.checked });
      fetchTaskList();
    } catch (error) {
      console.log(error);
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

  const DetailInfo = ({ task }: { task: Task }) => {
    //코멘트 조회

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
            {[1, 2, 3, 4, 5].map((d, index) => d >= task.importance && <div key={index}>{'⭐️ '}</div>)}
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
                  <S.LabelListItem key={label.title} color={label.color}>
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

                <S.TaskDetailIcon>
                  <S.EditIcon />
                  수정
                </S.TaskDetailIcon>
                <S.TaskDetailIcon>
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
            <S.TaskItem key={'task' + task.idx} data-idx={task.idx} data-tag={task.tagIdx} data-active={task.idx === activeTask} done={Number(task.done)} cols={CalcHeight(task)}>
              <S.TaskMainInfos>
                <S.TaskTime>{task.startedAt}</S.TaskTime>
                <S.TaskTitle>{task.title}</S.TaskTitle>
                {!task.isPublic && <S.LockerImage src="/lock.svg" />}
              </S.TaskMainInfos>
              {/*해당 메뉴는 상세 정보가 열려 있을 때만 표시 */}
              {task.idx === activeTask && <DetailInfo task={task} />}
            </S.TaskItem>
          )
        );
      })}
    </>
  );
};

export default TaskList;
