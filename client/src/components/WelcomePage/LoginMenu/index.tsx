import React, { useState } from 'react';
import * as S from './style';
import useInput from '../../../hooks/useInput';
import { Link } from 'react-router-dom';
import kakaoIcon from '../../../assets/kakao_icon.svg';
import githubIcon from '../../../assets/github_icon.png';
import { HOST } from '../../../constants';

const LoginMenu = () => {
  const [id, onChangeId, setId] = useInput('');
  const [pw, onChangePw, setPw] = useInput('');
  const [err, setErr] = useState('');

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      user_id: id,
      password: pw,
    };

    // axios.post('/users/login', data).then(res=>{
    //     //main으로 이동
    // })
    // .catch(error => {
    //     setErr("로그인에 실패했습니다.");
    // })
  };

  return (
    <S.Container>
      <S.MainTitle>Boostart</S.MainTitle>
      <S.LoginContainer>
        <S.LoginTitle>WELCOME :&gt;</S.LoginTitle>
        <S.LoginForm onSubmit={onLogin}>
          <S.InputBar value={id} onChange={onChangeId} placeholder="EMAIL" />
          <S.InputBar value={pw} onChange={onChangePw} placeholder="PASSWORD" type="password" />
          <h3>{err}</h3>
          <S.LoginButton type="submit">LOGIN</S.LoginButton>
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
