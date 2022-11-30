import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
`;

export const MainContentContainer = styled.div`
  margin: 0rem 4rem 0rem 4rem;
  width: 71.5rem;
  height: 40rem;
  display: flex;
  justify-content: space-between;
`;
export const LeftSection = styled.div`
  width: 25.6rem;
`;

export const RightSection = styled.div`
  width: 44.7rem;
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
