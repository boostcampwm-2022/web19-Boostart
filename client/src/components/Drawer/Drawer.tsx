import { useState } from 'react';
import { dummyNotifications, dummyReceivedFriendRequests } from '../common/dummy';
import {
  DrawerContainer,
  LogoutButton,
  ProfileEditButton,
  ProfileEditForm,
  ProfileSectionContainer,
  PROFILE_EDIT_FORM_Z_INDEX,
  PROFILE_EDIT_FORM_TOP,
  PROFILE_EDIT_FORM_LEFT,
  PROFILE_EDIT_FORM_TRANFORM,
  ReceivedFriendRequestSectionContainer,
} from './Drawer.style';
import Modal from './Modal';

const Drawer = ({ open }: { open: boolean }) => {
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);

  const handleProfileEditButtonClick = () => {
    setIsProfileEditModalOpen(true);
  };

  const handleLogoutButtonClick = () => {
    alert('서버에 로그아웃하겠다고 알릴게요');
  };

  return (
    <>
      <DrawerContainer open={open}>
        <ProfileEditButton onClick={handleProfileEditButtonClick}>프로필 수정</ProfileEditButton>
        <ProfileSection />
        <hr />
        <ReceivedFriendRequestSection />
        <hr />
        <NotificationSection />
        <LogoutButton onClick={handleLogoutButtonClick}>로그아웃</LogoutButton>
      </DrawerContainer>
      {isProfileEditModalOpen && (
        <Modal
          component={<ProfileEditForm>프로필 수정 모달</ProfileEditForm>}
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

const ProfileSection = () => {
  return (
    <ProfileSectionContainer>
      <img src="https://avatars.githubusercontent.com/u/55306894?s=80&u=aedb7854f1fd10d8eb6dc1272f1583dbb255f5b8&v=4" width="60" />
      <div>
        <div>모작 님 반갑습니다</div>
        <div>@mojac</div>
      </div>
    </ProfileSectionContainer>
  );
};

const ReceivedFriendRequestSection = () => {
  return (
    <ReceivedFriendRequestSectionContainer>
      {dummyReceivedFriendRequests.map(({ userId, username, profileImg }) => (
        <ReceivedFriendRequest userId={userId} username={username} profileImg={profileImg} />
      ))}
    </ReceivedFriendRequestSectionContainer>
  );
};

const ReceivedFriendRequest = ({ userId, username, profileImg }: { userId: string; username: string; profileImg: string }) => {
  const handleAcceptButtonClick = () => {
    alert(`${userId} 님의 친구 요청을 수락하겠다고 서버에 알릴게요.`);
  };

  const handleRejectButtonClick = () => {
    alert(`${userId} 님의 친구 요청을 거절하겠다고 서버에 알릴게요.`);
  };

  return (
    <>
      <img src={profileImg} />
      <div>
        <div>{username}</div>
        <div>@{userId}</div>
      </div>
      <div>
        <button onClick={handleAcceptButtonClick}>수락</button>
        <button onClick={handleRejectButtonClick}>거절</button>
      </div>
    </>
  );
};

const NotificationSection = () => {
  return (
    <>
      {dummyNotifications.map(({ idx, content }) => (
        <div>{content}</div>
      ))}
    </>
  );
};

export default Drawer;
