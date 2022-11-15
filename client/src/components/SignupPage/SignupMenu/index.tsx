import React, { useState } from 'react';
import * as S from './style';
import useInput from '../../../hooks/useInput';
import { Link, useNavigate } from 'react-router-dom';

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

  const handleSignupButtonClick = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <S.Container>
      <S.SignupContainer>
        <S.SignupTitle>LET'S JOIN US !</S.SignupTitle>
        <S.SignupForm>
          <S.ProfileImage>
            {profileImg ? <img src={URL.createObjectURL(profileImg)} alt="profile-img" /> : <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png" alt="profile-img" />}
            <S.EditRound>
              <input type="file" onChange={handleProfileImageChange} />
              <S.EditIcon />
            </S.EditRound>
          </S.ProfileImage>
          <S.InputBar value={userId} onChange={onChangeUserId} placeholder="ID" />
          <S.InputBar value={password} onChange={onChangePassword} placeholder="PASSWORD" type="password" />
          <S.InputBar value={username} onChange={onChangeUsername} placeholder="NICKNAME" type="password" />
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
