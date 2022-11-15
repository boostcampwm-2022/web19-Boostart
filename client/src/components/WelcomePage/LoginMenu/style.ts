import styled from 'styled-components';
export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
`;

export const LoginContainer = styled.div`
  width: 39rem;
  height: 28rem;
  background: white;
  border: 1px solid var(--color-gray1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.8rem;
  box-shadow: 0px 0px 10px 5px rgba(175, 175, 175, 0.25);
`;

export const LoginTitle = styled.div`
  font-family: 'Press Start 2P', cursive;
  font-size: 1rem;
  color: var(--color-main);
  margin: 2.1rem;
`;

export const LoginForm = styled.div`
  text-align: center;

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

export const LoginButton = styled.button`
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

export const SignUpButton = styled.button`
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

export const SocialLogin = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin: 1rem;
`;
export const Icon = styled.img`
  width: 2.7rem;
  height: 2.7rem;
  margin: 0.6rem;
`;
