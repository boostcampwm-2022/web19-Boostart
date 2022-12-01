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

  return (
    <>
      {taskList.map(({ tagIdx, idx, title, startedAt, endedAt, importance, location, content, done, isPublic, tagName, labels }) => {
        return (
          !isTaskFiltered(done) && (
            <>
              <S.TaskItem key={'task' + idx} data-idx={idx} data-tag={tagIdx} data-active={idx === activeTask} done={Number(done)}>
                <S.TaskMainInfos>
                  <S.TaskTime>{startedAt}</S.TaskTime>
                  <S.TaskTitle>{title}</S.TaskTitle>
                  {!isPublic && <S.LockerImage src="/lock.svg" />}
                </S.TaskMainInfos>
                {idx === activeTask && (
                  <>
                    <hr />
                    <S.TaskDetailInfos>
                      <S.TaskDetailInfosCol>
                        <S.TimeIcon />
                        {startedAt} ~ {endedAt}
                      </S.TaskDetailInfosCol>
                      <S.TaskDetailInfosCol>
                        <S.ImportanceIcon />
                        {[1, 2, 3, 4, 5].map((d) => d >= importance && <>{'⭐️ '}</>)}
                      </S.TaskDetailInfosCol>

                      {location && (
                        <S.TaskDetailInfosCol>
                          <S.LocationIcon />
                          {location}
                        </S.TaskDetailInfosCol>
                      )}
                    </S.TaskDetailInfos>
                    {content && (
                      <>
                        <hr />
                        <S.TaskDetailInfos>
                          <S.TaskDetailInfosCol height={'3rem'}>{content}</S.TaskDetailInfosCol>
                        </S.TaskDetailInfos>
                      </>
                    )}
                    <hr />
                    <S.TaskDetailInfos>
                      <S.TaskDetailInfosCol>
                        <S.CheckBox type="checkbox" id="done" data-idx={idx} defaultChecked={done} onChange={patchTaskDone} />
                        <S.CheckBoxLabel htmlFor="done">완료</S.CheckBoxLabel>
                        <S.CheckBoxLabel>수정</S.CheckBoxLabel>
                        <S.CheckBoxLabel htmlFor="complete">삭제</S.CheckBoxLabel>
                      </S.TaskDetailInfosCol>
                    </S.TaskDetailInfos>
                  </>
                )}
              </S.TaskItem>
            </>
          )
        );
      })}
    </>
  );
};

export default TaskList;
