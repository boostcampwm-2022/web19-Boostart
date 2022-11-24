import React, { useEffect, useState } from 'react';
import * as S from './LoginMenu.style';
import { Link, useNavigate } from 'react-router-dom';
import { HOST, RoutePath } from '../../constants';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const httpPostLogin = async ({ userId, password }: any) => {
  const response = await fetch(`${HOST}/api/v1/auth/login`, {
    method: 'post',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, password }),
  });
  return response;
};

const LoginMenu = () => {
  const navigate = useNavigate();
  const [err, setErr] = useState('');

  const schema = yup.object().shape({
    userId: yup.string().required('id is required.'),
    password: yup.string().min(8).max(15).required('password must be 8 - 15 characters.'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const loginFormSubmit = async (d: any) => {
    const response = await httpPostLogin(d);
    if (response.ok) navigate(RoutePath.LOG);
    else {
      const { msg } = await response.json();
      setErr(msg);
    }
  };

  useEffect(() => {
    setErr(Object.keys(errors).length !== 0 ? '아이디 또는 비밀번호 양식이 틀렸어요' : '');
  }, [errors]);

  return (
    <S.Container>
      <S.MainTitle>Boostart</S.MainTitle>
      <S.LoginContainer>
        <S.LoginTitle>WELCOME :&gt;</S.LoginTitle>
        <S.LoginForm onSubmit={handleSubmit(loginFormSubmit)}>
          <S.InputBar {...register('userId')} placeholder="ID" />
          <S.InputBar {...register('password')} placeholder="PASSWORD" type="password" />
          <h3>{err}</h3>
          <S.LoginButton type="submit">LOGIN</S.LoginButton>
          <Link to={RoutePath.SIGNUP} style={{ color: 'inherit', textDecoration: 'inherit' }}>
            <S.SignupButton>SIGN UP</S.SignupButton>
          </Link>
        </S.LoginForm>
        <S.SocialLogin>
          <a href={`${HOST}/api/v1/auth/login/kakao`}>
            <S.Icon src="./kakao_icon.svg" />
          </a>
          <a href={`${HOST}/api/v1/auth/login/github`}>
            <S.Icon src="./github_icon.png" />
          </a>
        </S.SocialLogin>
      </S.LoginContainer>
    </S.Container>
  );
};

export default LoginMenu;
