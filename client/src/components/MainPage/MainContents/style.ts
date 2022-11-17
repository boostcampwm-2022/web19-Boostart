import styled from 'styled-components';
export const Container = styled.div`
  width: 100vw;
  display: grid;
  justify-content: center;
`;

export const MainContentContainer = styled.div`
  width: 70rem;
  display: flex;
  justify-content: space-between;
  height: 0rem;
`;
export const LeftSection = styled.div`
  width: 24.6rem;
`;

export const RightSection = styled.div`
  width: 43.7rem;
`;

export const NewTaskButton = styled.div`
  cursor: pointer;
  position: relative;
  text-align: center;
  color: white;
  font-size: 1.6rem;
  line-height: 2.9rem;
  left: 40rem;
  bottom: 5.5rem;
  width: 3.1rem;
  height: 3.1rem;
  border-radius: 20rem;
  background-color: var(--color-main);
  box-shadow: 0px 0px 5px 3px rgba(175, 175, 175, 0.2);
`;
