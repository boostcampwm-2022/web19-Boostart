import styled from 'styled-components';
import { FiPlus } from 'react-icons/fi';
import { MdTimer, MdOutlineSentimentSatisfiedAlt, MdLocationPin } from 'react-icons/md';
import { RiDeleteBin2Fill, RiEdit2Fill } from 'react-icons/ri';

export const Comment = styled.img`
  & svg {
    fill: red;
    background-color: red;
    color: red;
  }
`;

export const TimeIcon = styled(MdTimer)`
  width: 14px;
  height: 14px;
  margin: 0px 5px 0px 0px;
  align-self: center;

  color: var(--color-gray5);
`;
export const ImportanceIcon = styled(MdOutlineSentimentSatisfiedAlt)`
  width: 14px;
  height: 14px;
  margin: 0px 5px 0px 0px;
  color: var(--color-gray5);
  align-self: center;
`;
export const LocationIcon = styled(MdLocationPin)`
  width: 14px;
  height: 14px;
  margin: 0px 5px 0px 0px;
  color: var(--color-gray5);
  align-self: center;
`;
export const EditIcon = styled(RiEdit2Fill)`
  width: 15px;
  height: 14px;
  color: var(--color-gray5);
  align-self: center;
  margin: 0px 2px 0px 2px;
`;
export const DeleteIcon = styled(RiDeleteBin2Fill)`
  width: 14px;
  height: 14px;
  color: var(--color-gray5);
  align-self: center;
  margin: 0px 2px 0px 2px;
`;

export const LogContainer = styled.div`
  width: 100%;
  height: 37rem;
  background: white;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 0px 10px 5px rgba(175, 175, 175, 0.25);
  user-select: none;
`;

export const LogTitle = styled.span`
  display: inline-block;
  color: white;
  font-size: 1.7rem;
  font-family: 'Press Start 2P', cursive;
  transform: translate(1.75rem, 0.43rem);
  z-index: 1;
  span {
    font-size: 1.2rem;
  }
`;

export const Grid = styled.div`
  display: grid;
  width: 43.5rem;
  height: 36rem;
  position: relative;
  grid-template-areas:
    'time nav'
    'time main';
  grid-template-columns: 1fr 16fr;
  grid-template-rows: 1fr 10fr;
  user-select: none;
`;

export const TimeBarSection = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  grid-area: time;
  cursor: default;

  img {
    width: 22px;
    height: 22px;
    filter: opacity(0.7);
  }
`;

export const TimeBar = styled.div`
  width: 13px;
  height: 31.2rem;
  position: relative;
  margin: 0.5rem 0 0 0;
  border: 2px solid #e3e3e3;
  border-radius: 0.5rem;
`;
export const TimeMarker = styled.div<{
  startedAt: number;
  duration: number;
}>`
  margin-left: 2px;
  width: 0.55rem;
  border-radius: 5rem;
  height: ${(props) => props.duration * 1.3}rem;
  position: absolute;
  background: var(--color-main);
  top: ${(props) => props.startedAt * 1.3}rem;
  transition: all 0.5s;
`;
export const LogNavBarSection = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: 0.5rem;
  padding-right: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  grid-area: nav;
  box-sizing: border-box;
  cursor: default;
`;

export const SortOptionSelect = styled.select`
  width: 5rem;
  border-radius: 0.5rem;
  margin-left: 1rem;
  color: #616161;
  font-size: 0.825rem;
  text-align: center;
  font-family: 'Noto Sans KR', sans-serif;
  option {
    width: 3rem;
    color: #616161;
    font-size: 0.625rem;
    font-family: 'Noto Sans KR', sans-serif;
  }
`;

export const LogMainSection = styled.div`
  width: 100%;
  height: 32rem;
  display: flex;
  font-family: 'Noto Sans KR', sans-serif;
  grid-area: main;
  cursor: default;
  overflow-x: scroll;
`;

export const TagWrap = styled.div`
  display: flex;
  margin: 0 0.2rem;
  flex-direction: column;
  z-index: 5;
  min-width: fit-content;
  height: 31rem;
  overflow: overlay;
`;
export const TagTitle = styled.div<{ color: string }>`
  width: 11rem;
  min-height: 2rem;
  margin: 0.25rem;
  padding: 0 0.75rem;
  display: flex;
  align-items: center;
  color: var(--color-gray7);
  font-size: 0.75rem;
  ${(props) => props.color && `background: ${props.color};`}
  border: 1px solid var(--color-gray4);
  box-shadow: 0px 0px 2px 1px rgba(190, 190, 190, 0.15);
  border-radius: 0.25rem;
`;

export const TaskItem = styled.div<{
  done: number;
  cols: number;
}>`
  width: 12.5rem;
  min-height: 2.1rem;
  max-height: 3rem;
  transition: min-height 0.4s ease-out;

  margin: 0.25rem 0.25rem;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  font-size: 0.75rem;
  background: ${(props) => (props.done === 1 ? '#F0F4FB' : 'white')};
  border-radius: 0.25rem;
  box-sizing: border-box;
  border: 1px solid var(--color-gray2);
  box-shadow: 0px 0px 2px 1.5px rgba(190, 190, 190, 0.1);

  &[data-active='true'] {
    min-height: calc(7.8rem + ${(props) => props.cols}rem);
    flex-direction: column;
  }
  & hr {
    margin: 0 auto;
    margin-top: 2px;
    width: 10.6rem;
    border: solid 0.1px var(--color-gray2);
  }
`;

export const TaskDetailInfos = styled.div<{ flex?: string }>`
  padding: 0.375rem 0.75rem;
  display: flex;
  flex-wrap: wrap;
  flex-direction: ${(props) => props.flex || 'column'};
`;
export const TaskDetailInfosCol = styled.div<{ height?: string }>`
  height: ${(props) => props.height || '1.2rem'};
  display: flex;
  line-height: 1.2rem;
  white-space: pre;
`;

export const TaskDetailIcon = styled.label`
  margin: 1px 1px;
  width: 3.3rem;
  height: 1.2rem;
  display: flex;
  color: var(--color-gray7);
  justify-content: center;
  text-align: center;
`;
export const TaskTime = styled.span`
  margin: 0 0.25rem 0 0;
  color: #959595;
`;

export const SelectedItem = styled.div<{
  x: number;
  y: number;
}>`
  width: 11rem;
  height: 2rem;
  margin: 0.25rem 0.25rem;
  padding: 0 0.75rem;
  position: absolute;
  top: ${(props) => props.y}px;
  left: ${(props) => props.x}px;
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  background: white;
  border: 1px solid gray;
  border-radius: 0.25rem;
  z-index: 6;
  pointer-events: none;
  border: 1px solid var(--color-gray2);
  box-shadow: 0px 0px 2px 1px rgba(190, 190, 190, 0.15);
  & span {
    margin: 0 0.25rem 0 0;
    color: #959595;
  }
`;

export const SlideObserver = styled.div<{
  direction: string;
}>`
  width: 3rem;
  height: 33rem;
  position: absolute;
  z-index: 7;
  ${(props) => (props.direction === 'right' ? 'right: 0;' : 'left: 0;')}
`;

export const TaskTitle = styled.div`
  width: 8rem;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const LockerImage = styled.img`
  width: 0.625rem;
`;

export const TaskMainInfos = styled.div`
  display: flex;
  align-items: center;
  padding: 0.375rem 0.75rem;

  pointer-events: none;
`;

export const CheckBoxContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const CheckBoxLabel = styled.label`
  color: #616161;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 0.75rem;
`;

export const CheckBox = styled.input`
  width: 0.625rem;
  margin-right: 0.25rem;
  border-radius: 0.5rem;
  accent-color: #7991db;
`;

export const DateArrow = styled.div`
  cursor: pointer;
`;

export const NewTaskButton = styled(FiPlus)`
  cursor: pointer;
  position: absolute;
  color: white;
  font-size: 1.6rem;
  left: 40rem;
  bottom: 1rem;
  padding: 0.5rem;
  width: 2rem;
  height: 2rem;
  border-radius: 20rem;
  background-color: var(--color-main);
  box-shadow: 0px 0px 5px 3px rgba(175, 175, 175, 0.2);
  z-index: 999;
`;

export const LabelListItem = styled.div`
  color: white;
  background-color: ${(props) => props.color || 'var(--color-gray5)'};
  padding: 1px 10px;
  height: 18px;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  font-size: 0.7rem;
  margin: 2px 3px;
`;

export const EmoticonContainer = styled.div`
  display: flex;
`;
export const Emoticon = styled.div`
  width: 35px;
  height: 43px;
  display: flex;
  background: url('/comment.svg');

  background-size: contain;

  justify-content: center;
  align-items: center;
`;
