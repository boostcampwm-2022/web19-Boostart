import styled from 'styled-components';
import { CgClose } from 'react-icons/cg';

export const ModalContainer = styled.div<{ isDetailOpen: boolean }>`
  position: relative;
  width: 36.4rem;
  height: ${(props) => (props.isDetailOpen ? '44rem' : '30.4rem')};
  transition: height 0.3s;
  background: white;
  border-radius: 1rem;
  box-shadow: 0px 0px 10px 5px rgba(175, 175, 175, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: top;
  align-items: center;
`;

export const Date = styled.div`
  color: var(--color-main);
  font-size: 1rem;
  height: 2rem;
  margin: 0.5rem;
  font-family: var(--font-title);
`;

export const TaskForm = styled.form``;

export const FormTable = styled.table`
  text-align: left;

  td:nth-child(1) {
    width: 4.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-gray7);
  }
  td:nth-child(2) {
    width: 24rem;
    height: 2.8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;
export const LagreTr = styled.tr`
  height: 5.6rem;

  td:nth-child(1) {
    width: 4.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-gray7);
    vertical-align: text-top;
  }
`;

export const TagInput = styled.div`
  margin: auto;
  z-index: 500;
`;
export const InputBar = styled.input`
  margin: auto;

  background: var(--color-gray0);
  border: 1px solid var(--color-gray3);
  border-radius: 8px;
  color: black;
  width: 22.6rem;
  height: 2.18rem;
  border-radius: 8px;
  font-size: 0.8rem;
  padding-left: 1rem;
  ::placeholder {
    font-size: 0.8rem;
    color: var(--color-gray2);
  }
`;

export const InputArea = styled.textarea`
  margin: auto;

  background: var(--color-gray0);
  border: 1px solid var(--color-gray3);
  border-radius: 8px;
  color: black;
  width: 22.6rem;
  height: 2.66rem;
  border-radius: 8px;
  font-size: 0.8rem;
  padding: 0.5rem 1rem 0.5rem 1rem;
  ::placeholder {
    font-size: 0.8rem;
    color: var(--color-gray2);
  }
`;

export const InputTimeBar = styled.input`
  background: var(--color-gray0);
  border: 1px solid var(--color-gray3);
  border-radius: 8px;
  color: black;
  font-family: inherit;
  width: 7rem;
  height: 2.18rem;
  border-radius: 8px;
  font-size: 0.8rem;
  padding-left: 1rem;
  padding-right: 1rem;
  ::-webkit-calendar-picker-indicator {
    width: 22px;
    height: 22px;
    filter: invert(40%);

    color: var(--color-gray3);
  }

  ::placeholder {
    font-size: 0.8rem;
    color: #a3a3a3;
  }
`;

export const DetailButton = styled.div`
  cursor: pointer;
`;
export const Border = styled.div`
  width: 28rem;
  h4 {
    color: var(--color-gray6);
    margin-top: 0.5rem;
    margin-bottom: 1.1rem;
    overflow: hidden;
    text-align: center;
    font-weight: 600;
    font-size: 0.8rem;
  }
  h4:before,
  h4:after {
    background-color: var(--color-gray4);
    content: '';
    display: inline-block;
    height: 1px;
    position: relative;
    vertical-align: middle;
    width: 50%;
  }
  h4:before {
    right: 0.8em;
    margin-left: -50%;
  }
  h4:after {
    left: 0.8em;
    margin-right: -50%;
  }
`;

export const CloseButton = styled(CgClose)`
  width: 1.7rem;
  height: 1.7rem;
  position: relative;
  left: 16rem;
  top: 1.1rem;
  color: var(--color-gray6);
  margin: 3px;
  cursor: pointer;
`;

export const SubmitButton = styled.button`
  background: var(--color-main);
  position: absolute;
  bottom: 1.6rem;
  font-family: var(--font-title);
  height: 2.3rem;
  border: 0px;
  border-radius: 3rem;
  color: white;
  width: 24rem;
  margin: 2rem;
  font-size: 0.8rem;
  cursor: pointer;
`;
