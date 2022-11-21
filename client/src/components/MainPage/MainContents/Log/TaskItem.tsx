import { Task } from 'GlobalType';
import * as S from './style';

interface taskListProps {
  taskList: Task[];
  activeTask: number | null;
}

const TaskList = ({ taskList, activeTask }: taskListProps) => {
  return (
    <>
      {taskList.map(({ tag_name, idx, title, startedAt, endedAt, importance, location, content }) => {
        return (
          <S.TaskItems key={'task' + idx} data-idx={idx} data-tag={tag_name} data-active={idx === activeTask}>
            <div>
              <S.TagTime>{startedAt}</S.TagTime> {title}
            </div>
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
          </S.TaskItems>
        );
      })}
    </>
  );
};

export default TaskList;
