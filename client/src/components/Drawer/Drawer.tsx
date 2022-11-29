import { useState } from 'react';
import { dummyNotifications, dummyReceivedFriendRequests } from '../common/dummy';
import { PROFILE_EDIT_FORM_Z_INDEX, PROFILE_EDIT_FORM_TOP, PROFILE_EDIT_FORM_LEFT, PROFILE_EDIT_FORM_TRANFORM } from './Drawer.style';
import { FRIEND_REQUEST_ACTION, HOST } from '../../constants';
import Modal from '../common/Modal';
import { Friend } from 'GlobalType';
import * as S from './Drawer.style';

interface DrawerProps {
  isOpen: boolean;
  friendRequests: Friend[] | null;
  handleFriendRequests: Function;
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

const Drawer = ({ isOpen, friendRequests, handleFriendRequests }: DrawerProps) => {
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);

  const handleProfileEditButtonClick = () => {
    setIsProfileEditModalOpen(true);
  };

  const handleLogoutButtonClick = () => {
    console.log('LogoutButtonClicked');
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
        <Modal component={<ProfileEditForm />} top={PROFILE_EDIT_FORM_TOP} left={PROFILE_EDIT_FORM_LEFT} transform={PROFILE_EDIT_FORM_TRANFORM} zIndex={PROFILE_EDIT_FORM_Z_INDEX} handleDimmedClick={() => setIsProfileEditModalOpen(false)} />
      )}
    </>
  );
};

const ProfileEditForm = () => {
  return (
    <S.ProfileEditForm>
      <S.ProfileSection horizonPadding="2rem">
        <S.Profile>
          <S.ProfileImage padding="2rem" size="10rem" src="https://avatars.githubusercontent.com/u/55306894?s=80&u=aedb7854f1fd10d8eb6dc1272f1583dbb255f5b8&v=4" />
          <S.ProfileInfo height="3.5rem" marginTop="-2rem">
            <S.SizedText fontSize="1.5rem">
              <S.Username>모작</S.Username>님
              <S.PencilIcon />
            </S.SizedText>
            <S.UserId>@mojac</S.UserId>
          </S.ProfileInfo>
        </S.Profile>
      </S.ProfileSection>
      <S.ProfileMessageSection>안녕하세요</S.ProfileMessageSection>
      <S.ProfileEditApplyButton>적용</S.ProfileEditApplyButton>
    </S.ProfileEditForm>
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
        <S.ProfileImage size="5rem" padding="1rem" src="https://avatars.githubusercontent.com/u/55306894?s=80&u=aedb7854f1fd10d8eb6dc1272f1583dbb255f5b8&v=4" />
        <S.ProfileInfo>
          <S.SizedText fontSize="1.1rem">
            <S.Username>모작</S.Username>님 반갑습니다
          </S.SizedText>
          <S.UserId>@mojac</S.UserId>
        </S.ProfileInfo>
      </S.Profile>
    </S.ProfileSection>
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
  return (
    <S.ReceivedFriendRequest>
      <S.ProfileImage size="4rem" padding="1rem" src={HOST + '/' + profileImg} />
      <S.ReceivedFriendRequestInfo>
        <S.Username>{username}</S.Username>
        <S.UserId>@{userId}</S.UserId>
      </S.ReceivedFriendRequestInfo>
      <S.ReceivedFriendRequestHandlingButtonSection>
        <S.RecievedFriendRequestRejectButton onClick={() => handleFriendRequests(idx)(FRIEND_REQUEST_ACTION.REJECT)} />
        <S.RecievedFriendRequestAcceptButton onClick={() => handleFriendRequests(idx)(FRIEND_REQUEST_ACTION.ACCEPT)} />
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
