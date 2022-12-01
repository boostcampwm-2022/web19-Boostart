import styled from 'styled-components';

export const Goal = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 40rem;
  padding: 1rem;
  border-radius: 20px;
  background-color: #dddddd;
  margin: 0.5rem auto;
  * {
    flex: 1;
    text-align: center;
  }
`;

export const GoalHead = styled(Goal)`
  background-color: var(--color-main);
`;
