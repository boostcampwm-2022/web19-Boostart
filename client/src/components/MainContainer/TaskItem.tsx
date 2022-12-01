import axios from 'axios';
import { Task, CompletionCheckBoxStatus } from 'GlobalType';
import { HOST } from '../../constants';
import * as S from './Log.style';

interface taskListProps {
  taskList: Task[];
  activeTask: number | null;
  completionFilter: CompletionCheckBoxStatus;
  fetchTaskList: () => Promise<void>;
}

const TaskList = ({ taskList, activeTask, completionFilter, fetchTaskList }: taskListProps) => {
  const isTaskFiltered = (done: boolean) => {
    if (done && !completionFilter.complete) return true;
    else if (!done && !completionFilter.incomplete) return true;
    return false;
  };

  const patchTaskDone = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const taskIdx = e.target.dataset.idx;
    try {
      const a = await axios.patch(`${HOST}/api/v1/task/${taskIdx}`, { done: e.target.checked });
      fetchTaskList();
    } catch (error) {
      console.log(error);
    }
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
            {[1, 2, 3, 4, 5].map((d) => d >= task.importance && <>{'⭐️ '}</>)}
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
              <S.TaskDetailInfosCol height={'content-fit'}>{task.content}</S.TaskDetailInfosCol>
            </S.TaskDetailInfos>
          </>
        )}
        {/* 해당 메뉴는 나의 Task 조회시에만 표시*/}
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
    );
  };

  return (
    // tagIdx, idx, title, startedAt, endedAt, importance, location, content, done, isPublic, tagName, labels
    <>
      {taskList.map((task: Task) => {
        return (
          !isTaskFiltered(task.done) && (
            <S.TaskItem key={'task' + task.idx} data-idx={task.idx} data-tag={task.tagIdx} data-active={task.idx === activeTask} done={Number(task.done)}>
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
