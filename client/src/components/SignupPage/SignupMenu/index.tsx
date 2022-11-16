import React, { useState } from 'react';
import * as S from './style';
import useInput from '../../../hooks/useInput';
import { Link, useNavigate } from 'react-router-dom';
import { DEFAULT_PROFILE_IMG_URL, HOST } from '../../../constants';

const userIdValidation = (userId: string) => {
  return userId.length >= 3 && userId.length <= 20;
};

const passwordValidation = (password: string) => {
  return password.length >= 4 && password.length <= 30;
};

const SignupMenu = () => {
  const [userId, onChangeUserId, setUserId] = useInput('');
  const [password, onChangePassword, setPassword] = useInput('');
  const [username, onChangeUsername, setUsername] = useInput('');
  const [profileImg, setProfileImg] = useState<File>();
  const [err, setErr] = useState('');

  const navigate = useNavigate();

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImg(e.target.files[0]);
    }
  };

  const handleSignupButtonClick = async () => {
    if (!userIdValidation(userId)) {
      alert('아이디 형식 오류');
      return;
    }
    if (!passwordValidation(password)) {
      alert('비밀번호 형식 오류');
      return;
    }

    const response = await fetch(`${HOST}/api/v1/auth/signup`, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, password, username }),
    });

    if (response.ok) {
      navigate('/');
    }
  };

  return (
    <S.Container>
      <S.SignupContainer>
        <S.SignupTitle>LET'S JOIN US !</S.SignupTitle>
        <S.SignupForm>
          <S.ProfileImage>
            <img src={profileImg ? URL.createObjectURL(profileImg) : DEFAULT_PROFILE_IMG_URL} alt="profile-img" />
            <S.EditRound>
              <input type="file" onChange={handleProfileImageChange} />
              <S.EditIcon />
            </S.EditRound>
          </S.ProfileImage>
          <S.InputBar value={userId} onChange={onChangeUserId} placeholder="ID" />
          <S.InputBar value={password} onChange={onChangePassword} placeholder="PASSWORD" type="password" />
          <S.InputBar value={username} onChange={onChangeUsername} placeholder="NICKNAME" />
          <h3>{err}</h3>
          <S.SignupButton type="button" onClick={handleSignupButtonClick}>
            SIGN UP
          </S.SignupButton>
          <Link to={'/'} style={{ color: 'inherit', textDecoration: 'inherit' }}>
            <S.LoginButton>LOGIN PAGE</S.LoginButton>
          </Link>
        </S.SignupForm>
      </S.SignupContainer>
    </S.Container>
  );
};

export default SignupMenu;
