import React, { useEffect, useState } from 'react';
import * as S from './style';
import { Link, useNavigate } from 'react-router-dom';
import { DEFAULT_PROFILE_IMG_URL, HOST } from '../../../constants';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const httpPostSignup = async ({ userId, password, username }: any) => {
  const response = await fetch(`${HOST}/api/v1/auth/signup`, {
    method: 'post',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, password, username }),
  });
  return response;
};

const SignupMenu = () => {
  const [profileImg, setProfileImg] = useState<File>();
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

  const navigate = useNavigate();

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImg(e.target.files[0]);
    }
  };

  const signupFormSubmit = async (d: any) => {
    const response = await httpPostSignup(d);
    if (response.ok) {
      navigate('/');
    } else {
      const { msg } = await response.json();
      setErr(msg);
    }
  };

  useEffect(() => {
    setErr(Object.keys(errors).length !== 0 ? '회원가입 양식이 틀렸어요' : '');
  }, [errors]);

  return (
    <S.Container>
      <S.SignupContainer>
        <S.SignupTitle>LET'S JOIN US !</S.SignupTitle>
        <S.SignupForm onSubmit={handleSubmit(signupFormSubmit)}>
          <S.ProfileImage>
            <img src={profileImg ? URL.createObjectURL(profileImg) : DEFAULT_PROFILE_IMG_URL} alt="profile-img" />
            <S.EditRound>
              <input type="file" onChange={handleProfileImageChange} />
              <S.EditIcon />
            </S.EditRound>
          </S.ProfileImage>
          <S.InputBar {...register('userId')} placeholder="ID" />
          <S.InputBar {...register('password')} placeholder="PASSWORD" type="password" />
          <S.InputBar {...register('username')} placeholder="NICKNAME" />
          <h3>{err}</h3>
          <S.SignupButton>SIGN UP</S.SignupButton>
          <Link to={'/'} style={{ color: 'inherit', textDecoration: 'inherit' }}>
            <S.LoginButton type="button">LOGIN PAGE</S.LoginButton>
          </Link>
        </S.SignupForm>
      </S.SignupContainer>
    </S.Container>
  );
};

export default SignupMenu;
