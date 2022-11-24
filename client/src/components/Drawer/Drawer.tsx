import { useState } from 'react';
import styled from 'styled-components';
import { dummyNotifications, dummyReceivedFriendRequests } from '../common/dummy';
import { PROFILE_EDIT_FORM_Z_INDEX, PROFILE_EDIT_FORM_TOP, PROFILE_EDIT_FORM_LEFT, PROFILE_EDIT_FORM_TRANFORM } from './Drawer.style';
import Modal from './Modal';
import * as S from './Drawer.style';

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
      <S.Drawer open={open}>
        <ProfileSection handleProfileEditButtonClick={handleProfileEditButtonClick} />
        <S.HorizontalRule />
        <ReceivedFriendRequestSection />
        <S.HorizontalRule />
        <NotificationSection />
        <S.LogoutButton onClick={handleLogoutButtonClick} href="#">
          로그아웃
        </S.LogoutButton>
      </S.Drawer>
      {isProfileEditModalOpen && (
        <Modal
          component={<S.ProfileEditForm>프로필 수정 모달</S.ProfileEditForm>}
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

interface ProfileSectionProps {
  handleProfileEditButtonClick: React.MouseEventHandler;
}

const ProfileSection = ({ handleProfileEditButtonClick }: ProfileSectionProps) => {
  return (
    <S.ProfileSection>
      <S.ProfileEditButton onClick={handleProfileEditButtonClick} href="#">
        프로필 수정
      </S.ProfileEditButton>
      <S.Profile>
        <S.MyProfileImage src="https://avatars.githubusercontent.com/u/55306894?s=80&u=aedb7854f1fd10d8eb6dc1272f1583dbb255f5b8&v=4" />
        <S.ProfileInfo>
          <S.Greeting>
            <S.Username>모작</S.Username> 님 반갑습니다
          </S.Greeting>
          <S.UserId>@mojac</S.UserId>
        </S.ProfileInfo>
      </S.Profile>
    </S.ProfileSection>
  );
};

const ReceivedFriendRequestSection = () => {
  return (
    <S.ReceivedFriendRequestSection>
      <S.SectionHeader>나에게 온 친구 요청</S.SectionHeader>
      <div>
        {dummyReceivedFriendRequests.map(({ userId, username, profileImg }) => (
          <ReceivedFriendRequest userId={userId} username={username} profileImg={profileImg} />
        ))}
      </div>
    </S.ReceivedFriendRequestSection>
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
    <S.ReceivedFriendRequest>
      <S.ReceivedFriendProfileImage src={profileImg} />
      <S.ReceivedFriendRequestInfo>
        <S.Username>{username}</S.Username>
        <S.UserId>@{userId}</S.UserId>
      </S.ReceivedFriendRequestInfo>
      <S.ReceivedFriendRequestHandlingButtonSection>
        <S.RecievedFriendRequestRejectButton onClick={handleRejectButtonClick} />
        <S.RecievedFriendRequestAcceptButton onClick={handleAcceptButtonClick} />
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
          <S.Notification>{content}</S.Notification>
        ))}
      </div>
    </S.NotificationSection>
  );
};

export default Drawer;
