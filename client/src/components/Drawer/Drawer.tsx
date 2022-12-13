import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { dummyNotifications } from '../common/dummy';
import { PROFILE_EDIT_FORM_Z_INDEX, PROFILE_EDIT_FORM_TOP, PROFILE_EDIT_FORM_LEFT, PROFILE_EDIT_FORM_TRANFORM } from './Drawer.style';
import { FRIEND_REQUEST_ACTION, HOST } from '../../constants';
import Modal from '../common/Modal';
import { Friend } from 'GlobalType';
import * as S from './Drawer.style';
import useInput from '../../hooks/useInput';
import { myInfo } from '../common/atoms';

interface DrawerProps {
  isOpen: boolean;
  friendRequests: Friend[] | null;
  handleFriendRequests: Function;
  handleLogoutButtonClick: React.MouseEventHandler;
}
interface ReceivedFriendRequestSectionProps {
  friendRequests: Friend[] | null;
  handleFriendRequests: Function;
}
interface ReceivedFriendRequestProps {
  idx: number;
  userId: string;
  username: string;
  profileImg: string;
  handleFriendRequests: Function;
}
interface ProfileSectionProps {
  handleProfileEditButtonClick: React.MouseEventHandler;
}

const Drawer = ({ isOpen, friendRequests, handleFriendRequests, handleLogoutButtonClick }: DrawerProps) => {
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);

  const handleProfileEditButtonClick = () => {
    setIsProfileEditModalOpen(true);
  };

  return (
    <>
      <S.Drawer isOpen={isOpen}>
        <ProfileSection handleProfileEditButtonClick={handleProfileEditButtonClick} />
        <S.HorizontalRule />
        <ReceivedFriendRequestSection friendRequests={friendRequests} handleFriendRequests={handleFriendRequests} />
        <S.HorizontalRule />
        <NotificationSection />
        <S.LogoutButton onClick={handleLogoutButtonClick} href="#">
          로그아웃
        </S.LogoutButton>
      </S.Drawer>
      {isProfileEditModalOpen && (
        <Modal
          component={<ProfileEditForm setIsProfileEditModalOpen={setIsProfileEditModalOpen} />}
          top={PROFILE_EDIT_FORM_TOP}
          left={PROFILE_EDIT_FORM_LEFT}
          transform={PROFILE_EDIT_FORM_TRANFORM}
          zIndex={PROFILE_EDIT_FORM_Z_INDEX}
          handleDimmedClick={() => setIsProfileEditModalOpen(false)}
        />
      )}
    </>
  );
};

const ProfileEditForm = ({ setIsProfileEditModalOpen }: { setIsProfileEditModalOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  //api 연결
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const myProfile = useRecoilValue(myInfo);
  const [username, onUsernameChange, setUsername] = useInput(myProfile!.username);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImg(e.target.files[0]);
    }
  };

  const postProfileChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username === '') return;
    const profileFormData = new FormData();
    profileFormData.append('username', username);
    if (profileImg) profileFormData.append('profileImg', profileImg);
    try {
      const response = await fetch(`${HOST}/api/v1/user/me`, {
        method: 'PATCH',
        credentials: 'include',
        body: profileFormData,
      });
      if (response.status == 200) setIsProfileEditModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <S.ProfileEditForm onSubmit={postProfileChange}>
      <S.Profile>
        <S.ProfileImageForm>
          <img src={profileImg ? URL.createObjectURL(profileImg) : `${HOST}/${myProfile!.profileImg}`} alt="profile-img" />
          <S.EditRound>
            <input type="file" onChange={handleProfileImageChange} />
            <S.EditIcon />
          </S.EditRound>
        </S.ProfileImageForm>
        <S.ProfileInfo height="3.5rem" marginTop="-2rem">
          <S.SizedText fontSize="14px">
            <S.InputBar placeholder="NICKNAME" value={username} onChange={onUsernameChange} /> 님
          </S.SizedText>
          <S.UserId>@{myProfile!.userId}</S.UserId>
        </S.ProfileInfo>
      </S.Profile>
      <S.ProfileEditApplyButton type="submit" isDone={username === ''}>
        PROFILE CHANGE
      </S.ProfileEditApplyButton>
    </S.ProfileEditForm>
  );
};

const ProfileSection = ({ handleProfileEditButtonClick }: ProfileSectionProps) => {
  const myProfile = useRecoilValue(myInfo);
  return (
    <>
      {myProfile && (
        <S.ProfileSection>
          <S.ProfileEditButton onClick={handleProfileEditButtonClick} href="#">
            프로필 수정
          </S.ProfileEditButton>
          <S.Profile>
            <S.ProfileImage size="5rem" padding="1rem" src={HOST + '/' + myProfile.profileImg} />
            <S.ProfileInfo>
              <S.SizedText fontSize="1.1rem">
                <S.Username>{myProfile.username}</S.Username>님 반갑습니다
              </S.SizedText>
              <S.UserId>@{myProfile.userId}</S.UserId>
            </S.ProfileInfo>
          </S.Profile>
        </S.ProfileSection>
      )}
    </>
  );
};

const ReceivedFriendRequestSection = ({ friendRequests, handleFriendRequests }: ReceivedFriendRequestSectionProps) => {
  return (
    <S.ReceivedFriendRequestSection>
      <S.SectionHeader>나에게 온 친구 요청</S.SectionHeader>
      <div>
        {friendRequests && friendRequests.map(({ idx, userId, username, profileImg }) => <ReceivedFriendRequest key={userId} idx={idx} userId={userId} username={username} profileImg={profileImg} handleFriendRequests={handleFriendRequests} />)}
      </div>
    </S.ReceivedFriendRequestSection>
  );
};

const ReceivedFriendRequest = ({ idx, userId, username, profileImg, handleFriendRequests }: ReceivedFriendRequestProps) => {
  const rejectFriendRequest = handleFriendRequests(FRIEND_REQUEST_ACTION.REJECT);
  const acceptFriendRequest = handleFriendRequests(FRIEND_REQUEST_ACTION.ACCEPT);
  return (
    <S.ReceivedFriendRequest>
      <S.ProfileImage size="4rem" padding="1rem" src={HOST + '/' + profileImg} />
      <S.ReceivedFriendRequestInfo>
        <S.Username>{username}</S.Username>
        <S.UserId>@{userId}</S.UserId>
      </S.ReceivedFriendRequestInfo>
      <S.ReceivedFriendRequestHandlingButtonSection>
        <S.RecievedFriendRequestRejectButton onClick={() => rejectFriendRequest(idx)} />
        <S.RecievedFriendRequestAcceptButton onClick={() => acceptFriendRequest(idx)} />
      </S.ReceivedFriendRequestHandlingButtonSection>
    </S.ReceivedFriendRequest>
  );
};

const NotificationSection = () => {
  return (
    <S.NotificationSection>
      <S.SectionHeader>알림</S.SectionHeader>
      <div>
        {dummyNotifications.map(({ idx, content }) => (
          <S.Notification key={idx}>{content}</S.Notification>
        ))}
      </div>
    </S.NotificationSection>
  );
};

export default Drawer;
