import React, { useState } from 'react';
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
  const [messageFromServer, setMessageFromServer] = useState('');

  const schema = yup.object().shape({
    userId: yup.string().required('아이디를 입력해주세요.').min(3, '아이디는 3자 이상 20자 이하여야 해요.').max(20, '아이디는 3자 이상 20자 이하여야 해요.'),
    password: yup.string().required('비밀번호를 입력해주세요.').min(8, '비밀번호는 8자 이상 20자 이하여야 해요.').max(20, '비밀번호는 8자 이상 20자 이하여야 해요.'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], '입력한 비밀번호와 일치하지 않아요.'),
    username: yup.string().required('닉네임을 입력해주세요.').min(2, '닉네임은 2자 이상 8자 이하여야 해요.').max(8, '닉네임은 2자 이상 8자 이하여야 해요.'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
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
      setMessageFromServer(msg);
    }
  };

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
          <h3>{errors.userId?.message as string}</h3>
          <S.InputBar {...register('password')} placeholder="PASSWORD" type="password" />
          <h3>{errors.password?.message as string}</h3>
          <S.InputBar {...register('confirmPassword')} placeholder="PASSWORD" type="password" />
          <h3>{errors.confirmPassword?.message as string}</h3>
          <S.InputBar {...register('username')} placeholder="NICKNAME" />
          <h3>{errors.username?.message as string}</h3>

          <h3>{messageFromServer}</h3>
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
