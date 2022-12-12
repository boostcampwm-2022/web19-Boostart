import styled from 'styled-components';
import { BsFillCameraFill } from 'react-icons/bs';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
`;
export const SignupContainer = styled.div`
  width: 39rem;
  height: 43rem;
  background: white;
  border: 1px solid var(--color-gray1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.8rem;
  box-shadow: 0px 0px 10px 5px rgba(175, 175, 175, 0.25);
`;

export const SignupTitle = styled.div`
  font-family: 'Press Start 2P', cursive;
  font-size: 1rem;
  color: var(--color-main);
  margin-bottom: 2.1rem;
`;

export const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    color: grey;
    display: block;
    width: 23rem;
    height: 0.9rem;
    margin: 0.3rem;
    font-size: 0.7rem;
    font-weight: bold;
  }
`;

export const ProfileImage = styled.div`
  width: 140px;
  position: relative;
  margin: auto;
  margin-bottom: 1.3rem;
  img {
    border: 6px solid var(--color-gray1);
    height: 8rem;
    width: 8rem;
    object-fit: cover;
    border-radius: 10rem;
  }
`;

export const EditRound = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--color-main);
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  input[type='file'] {
    position: absolute;
    transform: scale(2);
    opacity: 0;
    cursor: pointer;
  }
`;

export const EditIcon = styled(BsFillCameraFill)`
  width: 1.4rem;
  height: 1.4rem;
  display: block;
  color: white;
`;

export const InputBar = styled.input`
  background: var(--color-gray0);
  border: 1px solid var(--color-gray3);
  border-radius: 8px;
  color: black;
  margin: 0.4rem;
  width: 23rem;
  height: 2.3rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  padding-left: 1rem;

  ::placeholder {
    font-size: 0.8rem;
    color: #a3a3a3;
  }
`;

export const SignupButton = styled.button`
  background: var(--color-main);
  font-family: 'Press Start 2P', cursive;
  border: 0px;
  border-radius: 3rem;
  color: white;
  margin: 0.4rem;
  width: 24rem;
  height: 2.3rem;
  font-size: 0.8rem;
  cursor: pointer;
`;

export const LoginButton = styled.button`
  background: white;
  font-family: 'Press Start 2P', cursive;
  border: 3px solid var(--color-main);
  border-radius: 3rem;
  color: var(--color-main);
  margin: 0.4rem;
  width: 24rem;
  height: 2.3rem;
  font-size: 0.8rem;
  cursor: pointer;
`;

export const Form = styled.form``;
