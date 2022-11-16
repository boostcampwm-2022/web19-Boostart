import React, { useState } from 'react';
import * as S from './style';
import useInput from '../../../hooks/useInput';
import { Link, useNavigate } from 'react-router-dom';
import kakaoIcon from '../../../assets/kakao_icon.svg';
import githubIcon from '../../../assets/github_icon.png';
import { HOST } from '../../../constants';

const LoginMenu = () => {
  const navigate = useNavigate();
  const [userId, onChangeUserId, setUserId] = useInput('');
  const [password, onChangePassword, setPassword] = useInput('');
  const [err, setErr] = useState('');

  const handleLoginButtonClick = async () => {
    const response = await fetch(`${HOST}/api/v1/auth/login`, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, password }),
    });
    if (response.ok) navigate('/main');
    else setErr('아이디 또는 비밀번호가 틀렸어요');
  };

  return (
    <S.Container>
      <S.MainTitle>Boostart</S.MainTitle>
      <S.LoginContainer>
        <S.LoginTitle>WELCOME :&gt;</S.LoginTitle>
        <S.LoginForm>
          <S.InputBar value={userId} onChange={onChangeUserId} placeholder="ID" />
          <S.InputBar value={password} onChange={onChangePassword} placeholder="PASSWORD" type="password" />
          <h3>{err}</h3>
          <S.LoginButton type="button" onClick={handleLoginButtonClick}>
            LOGIN
          </S.LoginButton>
          <Link to={'/signup'} style={{ color: 'inherit', textDecoration: 'inherit' }}>
            <S.SignupButton>SIGN UP</S.SignupButton>
          </Link>
        </S.LoginForm>
        <S.SocialLogin>
          <a href={`${HOST}/api/v1/auth/login/kakao`}>
            <S.Icon src={kakaoIcon} />
          </a>
          <a href={`${HOST}/api/v1/auth/login/github`}>
            <S.Icon src={githubIcon} />
          </a>
        </S.SocialLogin>
      </S.LoginContainer>
    </S.Container>
  );
};

export default LoginMenu;
