import React, { useState } from 'react';
import * as S from './style';
import useInput from '../../../hooks/useInput';
import { Link } from 'react-router-dom';
import icon1 from '../../../assets/kakao_icon.svg';
import icon2 from '../../../assets/github_icon.png';

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
          <S.InputBar value={id} onChange={onChangeId} placeholder="ID" />
          <S.InputBar value={pw} onChange={onChangePw} placeholder="PASSWORD" type="password" />
          <h3>{err}</h3>
          <S.LoginButton type="submit">LOGIN</S.LoginButton>
          <Link to={'/signup'} style={{ color: 'inherit', textDecoration: 'inherit' }}>
            <S.SignUpButton>SIGN UP</S.SignUpButton>
          </Link>
        </S.LoginForm>
        <S.SocialLogin>
          <S.Icon src={icon1} /> <S.Icon src={icon2} />
        </S.SocialLogin>
      </S.LoginContainer>
    </S.Container>
  );
};

export default LoginMenu;
