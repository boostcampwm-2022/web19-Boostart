import React, { useState } from 'react';
import * as S from './style';
import useInput from '../../../hooks/useInput';
import { Link, useNavigate } from 'react-router-dom';

const SignupMenu = () => {
  const [id, onChangeId, setId] = useInput('');
  const [pw, onChangePw, setPw] = useInput('');
  const [name, onChangeName, setName] = useInput('');
  const [profileimg, setProfileImg] = useState<File | null>(null);
  const [err, setErr] = useState('');

  const history = useNavigate();

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImg(e.target.files[0]);
    }
  };

  const onSignup = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('userImage', profileimg!);

    const signUpData = {
      user_id: id,
      password: pw,
      username: name,
      profile_img: formData,
      oauth_type: '',
      oauth_email: '',
    };
    //axios.post('/signup', data).then(res=>{
    //   if(res.data.isSuccess)
    //   {
    //       alert("가입이 완료되었습니다.");
    //       history.push('/');
    //   }
    // })
    // .catch(error => {
    //     에러코드 식별
    //     setErr("회원가입에 실패했습니다.");
    // })
  };

  return (
    <S.Container>
      <S.SignupContainer>
        <S.SignupTitle>LET'S JOIN US !</S.SignupTitle>
        <S.SignupForm onSubmit={onSignup}>
          <S.ProfileImage>
            {profileimg ? <img src={URL.createObjectURL(profileimg)} alt="profile-img" /> : <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png" alt="profile-img" />}
            <S.EditRound>
              <input type="file" onChange={handleProfileImageChange} />
              <S.EditIcon />
            </S.EditRound>
          </S.ProfileImage>

          <S.InputBar value={id} onChange={onChangeId} placeholder="ID" />
          <S.InputBar value={pw} onChange={onChangePw} placeholder="PASSWORD" type="password" />
          <S.InputBar value={name} onChange={onChangeName} placeholder="NICKNAME" type="password" />
          <h3>{err}</h3>
          <S.SignupButton type="submit">SIGN UP</S.SignupButton>
          <Link to={'/'} style={{ color: 'inherit', textDecoration: 'inherit' }}>
            <S.LoginButton>LOGIN PAGE</S.LoginButton>
          </Link>
        </S.SignupForm>
      </S.SignupContainer>
    </S.Container>
  );
};

export default SignupMenu;