import { dummyNotifications, dummyReceivedFriendRequests } from '../common/dummy';
import { DrawerContainer, ProfileSectionContainer, ReceivedFriendRequestSectionContainer } from './Drawer.style';

const Drawer = () => {
  return (
    <DrawerContainer>
      <ProfileSection />
      <hr />
      <ReceivedFriendRequestSection />
      <hr />
      <NotificationSection />
    </DrawerContainer>
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
        <>
          <img src={profileImg} />
          <div>
            <div>{username}</div>
            <div>@{userId}</div>
          </div>
        </>
      ))}
    </ReceivedFriendRequestSectionContainer>
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
