import { Task } from 'GlobalType';
import * as S from './style';

interface taskListProps {
  taskList: Task[];
  activeTask: number | null;
}

const TaskList = ({ taskList, activeTask }: taskListProps) => {
  return (
    <>
      {taskList.map(({ tag_name, idx, title, startedAt, endedAt, importance, location, content, done, isPublic }) => {
        return (
          <S.TaskItem key={'task' + idx} data-idx={idx} data-tag={tag_name} data-active={idx === activeTask} done={done}>
            <S.TaskMainInfos>
              <S.TaskTime>{startedAt}</S.TaskTime>
              <S.TaskTitle>{title}</S.TaskTitle>
              {!isPublic && <S.LockerImage src="./lock.svg" />}
            </S.TaskMainInfos>

            {idx === activeTask && (
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
          </S.TaskItem>
        );
      })}
    </>
  );
};

export default TaskList;
