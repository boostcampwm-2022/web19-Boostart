import styled from 'styled-components';

export const LogTitle = styled.span`
  display: inline-block;
  color: white;
  font-size: 1.7rem;
  font-family: 'Press Start 2P', cursive;
  transform: translate(1.75rem, 0.43rem);
  z-index: 1;
`;

export const LogContainer = styled.div`
  width: 100%;
  height: 36rem;
  background: white;
  border-radius: 1rem;
  margin-top: 0rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  position: relative;
  display: grid;
  grid-template-areas:
    'time nav'
    'time main';
  grid-template-columns: 1fr 16fr;
  grid-template-rows: 1fr 10fr;
  box-shadow: 0px 0px 10px 5px rgba(175, 175, 175, 0.25);
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
`;

export const TimeBar = styled.div`
  width: 0.8rem;
  height: 31.2rem;
  position: relative;
  margin: 0.75rem 0 0;
  border: 2px solid #e3e3e3;
  border-radius: 0.5rem;
`;
export const TimeMarker = styled.div<{
  startedAt: number;
  duration: number;
}>`
  width: 0.85rem;
  height: ${(props) => props.duration * 1.3}rem;
  position: absolute;
  background: #99b1db;
  top: ${(props) => props.startedAt * 1.3}rem;
  transition: all 0.5s;
`;
export const LogNavBarSection = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  grid-area: nav;
  box-sizing: border-box;
  cursor: default;
`;

export const SortOptionSelect = styled.select`
  border-radius: 0.5rem;
  margin-left: 1rem;
  color: #616161;
  font-size: 0.825rem;
  font-family: 'Noto Sans KR', sans-serif;
  text-align: center;
  option {
    color: #616161;
    font-size: 0.625rem;
    font-family: 'Noto Sans KR', sans-serif;
  }
`;

export const DateController = styled.span`
  color: #99b1db;
  font-size: 1.5rem;
  font-family: 'Press Start 2P', cursive;
  cursor: default;
`;

export const LogMainSection = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-wrap: no-wrap;
  overflow-x: scroll;
  font-family: 'Noto Sans KR', sans-serif;
  grid-area: main;
  cursor: default;
`;

export const TagWrap = styled.div`
  height: 29rem;
  display: flex;
  margin: 0 0.25rem;
  flex-direction: column;
  z-index: 5;
`;
export const TagTitle = styled.div`
  width: 11rem;
  height: 2rem;
  margin: 0.25rem 0.25rem;
  padding: 0 0.75rem;
  display: flex;
  align-items: center;
  color: #616161;
  font-size: 0.75rem;
  background: #ffcece;
  border: 1px solid gray;
  border-radius: 0.25rem;
`;

export const TagItems = styled.div`
  width: 11rem;
  height: 2rem;
  margin: 0.25rem 0.25rem;
  padding: 0 0.75rem;
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  background: white;
  border: 1px solid gray;
  border-radius: 0.25rem;
  transition: height 1s;
  &[data-active='true'] {
    height: 10rem;
    padding: 0.5rem 0.75rem;
    flex-direction: column;
    align-items: flex-start;
    overflow: hidden;
  }
  & hr {
    width: 10rem;
  }
  & * {
    pointer-events: none;
  }
`;

export const TagTime = styled.span`
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

  & span {
    margin: 0 0.25rem 0 0;
    color: #959595;
  }
`;

export const slideObserver = styled.div<{
  direction: string;
}>`
  width: 3rem;
  height: 100%;
  position: absolute;
  z-index: 7;
  ${(props) => (props.direction === 'right' ? 'right: 0;' : 'left: 0;')}
`;