import styled from 'styled-components';

// 최상위 레이아웃
export const DRAWER_WIDTH = '23rem';
export const DRAWER_HORIZON_PADDING = '2rem';
export const DRAWER_RIGHT = `calc(-${DRAWER_WIDTH} + calc(-${DRAWER_HORIZON_PADDING}*2))`;
export const DRAWER_HEIGHT = '100%';

export const DRAWER_Z_INDEX = 999;
export const DRAWER_TOP = '0';

export const Drawer = styled.div<{ open: boolean }>`
  position: fixed;
  display: flex;
  flex-direction: column;
  z-index: ${DRAWER_Z_INDEX};
  top: 0;
  right: ${DRAWER_RIGHT};
  width: ${DRAWER_WIDTH};
  height: ${DRAWER_HEIGHT};
  padding: 0 ${DRAWER_HORIZON_PADDING};
  background-color: #ffffff;
  transition: all ease 1s;
  ${(props) => props.open && `transform: translateX(${DRAWER_RIGHT});`}
`;

// 공통
export const HorizontalRule = styled.hr`
  border: none;
  border-top: 1px solid #d0d0d0;
`;

export const SectionHeader = styled.h3`
  &::before {
    content: '·';
    margin-right: 0.5rem;
  }
  font-size: 1.1rem;
  font-weight: bold;
`;

export const Username = styled.span`
  font-weight: bold;
  margin-right: 0.3rem;
`;

export const UserId = styled.span`
  color: #707070;
  font-size: 0.9rem;
`;

const ProfileImage = styled.img`
  border-radius: 50%;
`;

// 프로필 수정
export const ProfileEditButton = styled.a`
  font-weight: bold;
  color: black;
  text-decoration: none;
  margin-left: auto;
`;

export const PROFILE_EDIT_FORM_WIDTH = '40rem';
export const PROFILE_EDIT_FORM_HEIGHT = '30rem';
export const PROFILE_EDIT_FORM_Z_INDEX = 1001;
export const PROFILE_EDIT_FORM_TOP = '50%';
export const PROFILE_EDIT_FORM_LEFT = '50%';
export const PROFILE_EDIT_FORM_TRANFORM = 'translate(-50%, -50%)';
export const ProfileEditForm = styled.div`
  background-color: white;
  width: ${PROFILE_EDIT_FORM_WIDTH};
  height: ${PROFILE_EDIT_FORM_HEIGHT};
  border-radius: 20px;
`;

// 프로필 영역
export const ProfileSection = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 1.1rem 0;
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 15rem;
  height: 3rem;
`;

export const Greeting = styled.span`
  font-size: 1.1rem;
`;

export const MyProfileImage = styled(ProfileImage)`
  width: 5rem;
  height: 5rem;
  padding: 1rem;
`;

// 받은 친구 요청 영역
export const ReceivedFriendProfileImage = styled(ProfileImage)`
  width: 4rem;
  height: 4rem;
  padding: 1rem;
`;

export const ReceivedFriendRequestSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ReceivedFriendRequest = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 1rem;
  background-color: #f8f8f8;
  margin: 1rem 0;
  padding: 0 1rem;
  align-items: center;
`;

export const ReceivedFriendRequestInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 7rem;
`;

export const ReceivedFriendRequestHandlingButtonSection = styled.div`
  display: flex;
  width: 7rem;
  justify-content: space-evenly;
`;

const RECIEVED_FRIEND_REQUEST_HANDLING_ICON_SIZE = `2.1rem`;
const RecievedFriendRequestHandlingButton = styled.img`
  width: ${RECIEVED_FRIEND_REQUEST_HANDLING_ICON_SIZE};
  height: ${RECIEVED_FRIEND_REQUEST_HANDLING_ICON_SIZE};
  cursor: pointer;
`;

const RECIEVED_FRIEND_REQUEST_ACCEPT_ICON_URL = 'https://icon-library.com/images/circle-check-icon/circle-check-icon-3.jpg';
export const RecievedFriendRequestAcceptButton = styled(RecievedFriendRequestHandlingButton)`
  content: url(${RECIEVED_FRIEND_REQUEST_ACCEPT_ICON_URL});
`;

const RECIEVED_FRIEND_REQUEST_REJECT_ICON_URL = 'https://icon-library.com/images/x-icon-png/x-icon-png-10.jpg';
export const RecievedFriendRequestRejectButton = styled(RecievedFriendRequestHandlingButton)`
  content: url(${RECIEVED_FRIEND_REQUEST_REJECT_ICON_URL});
`;

// 알림 영역
export const NotificationSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Notification = styled.div`
  margin: 0.3rem 0;
  margin-left: 0.5rem;
  &::before {
    content: '-';
    margin-right: 0.5rem;
  }
`;

// 로그아웃 버튼
export const LogoutButton = styled.a`
  font-weight: bold;
  color: black;
  text-decoration: none;
  margin-left: auto;
  margin-top: auto;
  padding-bottom: 1rem;
`;
