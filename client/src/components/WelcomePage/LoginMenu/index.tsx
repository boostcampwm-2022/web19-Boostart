import React, { useState } from 'react';
import * as S from './style';
import useInput from '../../../hooks/useInput';
import { Link } from 'react-router-dom';
import kakaoIcon from '../../../assets/kakao_icon.svg';
import githubIcon from '../../../assets/github_icon.png';

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
  };

  // axios.post('/users/login', data).then(res=>{
  //     //main으로 이동
  // })
  // .catch(error => {
  //     setErr("로그인에 실패했습니다.");
  // })

  type OAuthType = 'github' | 'kakao';
  const handleOAuthLoginButtonClick = (oauthType: OAuthType) => async () => {
    window.location.href = `http://localhost:8000/api/v1/auth/login/${oauthType}`;
  };

  return (
    <S.LoginContainer>
      <S.LoginTitle>WELCOME :&gt;</S.LoginTitle>
      <S.LoginForm onSubmit={onLogin}>
        <S.InputBar value={id} onChange={onChangeId} placeholder="EMAIL" />
        <S.InputBar value={pw} onChange={onChangePw} placeholder="PASSWORD" type="password" />
        <h3>{err}</h3>
        <S.LoginButton type="submit">LOGIN</S.LoginButton>
        <Link to={'/signup'} style={{ color: 'inherit', textDecoration: 'inherit' }}>
          <S.SignUpButton>SIGN UP</S.SignUpButton>
        </Link>
      </S.LoginForm>
      <S.SocialLogin>
        <S.Icon src={kakaoIcon} onClick={handleOAuthLoginButtonClick('kakao')} /> <S.Icon src={githubIcon} onClick={handleOAuthLoginButtonClick('github')} />
      </S.SocialLogin>
    </S.LoginContainer>
  );
};

export default LoginMenu;
