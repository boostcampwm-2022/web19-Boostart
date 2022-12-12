import { BsFillCameraFill } from 'react-icons/bs';
import styled from 'styled-components';

// 최상위 레이아웃
const DRAWER_WIDTH = '23rem';
const DRAWER_HEIGHT = '100%';
const DRAWER_HORIZON_PADDING = '2rem';
const DRAWER_RIGHT = `calc(-${DRAWER_WIDTH} + calc(-${DRAWER_HORIZON_PADDING}*2))`;

export const DRAWER_Z_INDEX = 999;

const unselectable = `
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
  user-select: none;
`;

export const Drawer = styled.div<{ isOpen: boolean }>`
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
  ${(props) => props.isOpen && `transform: translateX(${DRAWER_RIGHT});`}
  img {
    ${unselectable}
  }
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
  margin-right: 0.5rem;
`;

export const UserId = styled.span`
  color: var(--color-gray6);
  font-size: 1rem;
  line-height: 3rem;
`;

export const SizedText = styled.span<{ fontSize: string }>`
  font-size: ${(props) => props.fontSize};
  display: flex;
  align-items: center;
`;

export const ProfileImage = styled.img<{ size?: string; padding?: string }>`
  border-radius: 50%;
  ${(props) => props.size && `width: ${props.size}; height: ${props.size};`}
  ${(props) => props.padding && `padding: ${props.padding};`}
`;

export const PencilIcon = styled.img`
  content: url(https://cdn-icons-png.flaticon.com/512/116/116996.png);
  width: 1rem;
  margin-left: 0.5rem;
`;

// 프로필 수정
export const ProfileEditButton = styled.a`
  font-weight: bold;
  color: black;
  text-decoration: none;
  margin-left: auto;
`;

const PROFILE_EDIT_FORM_WIDTH = '35rem';
const PROFILE_EDIT_FORM_HEIGHT = '20rem';
export const PROFILE_EDIT_FORM_Z_INDEX = 1001;
export const PROFILE_EDIT_FORM_TOP = '50%';
export const PROFILE_EDIT_FORM_LEFT = '50%';
export const PROFILE_EDIT_FORM_TRANFORM = 'translate(-50%, -50%)';
export const ProfileEditForm = styled.form`
  display: flex;
  flex-direction: column;
  background-color: white;
  width: ${PROFILE_EDIT_FORM_WIDTH};
  height: ${PROFILE_EDIT_FORM_HEIGHT};
  border-radius: 30px;
  justify-content: center;
  align-items: center;
`;

export const ProfileMessageSection = styled.div`
  background-color: #f8f8f8;
  border-radius: 20px;
  height: 10rem;
  padding: 2rem;
  margin: 0 3rem;
`;

export const ProfileImageForm = styled.div`
  width: 140px;
  position: relative;
  margin: auto;
  img {
    border: 6px solid var(--color-gray1);
    height: 10rem;
    width: 10rem;
    object-fit: cover;
    border-radius: 10rem;
  }
  margin: 30px 80px 30px 30px;
`;

export const EditRound = styled.div`
  position: absolute;
  bottom: 10px;
  right: -30px;
  background: var(--color-main);
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  input[type='file'] {
    position: absolute;
    transform: scale(2);
    opacity: 0;
    cursor: pointer;
  }
`;

export const EditIcon = styled(BsFillCameraFill)`
  width: 1.4rem;
  height: 1.4rem;
  display: block;
  color: white;
`;

export const InputBar = styled.input`
  background: var(--color-gray0);
  border: 1px solid var(--color-gray3);
  border-radius: 8px;
  color: black;
  width: 10rem;
  margin: 5px 10px 5px 0px;
  height: 2.3rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  padding-left: 1rem;

  ::placeholder {
    font-size: 0.8rem;
    color: #a3a3a3;
  }
`;

export const ProfileEditApplyButton = styled.button<{ isDone: boolean }>`
  width: 18.5rem;
  height: 2rem;
  border: none;
  border-radius: 1rem;
  color: white;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.875rem;
  text-align: center;
  line-height: 2rem;
  margin-bottom: 30px;
  cursor: pointer;
  background: ${(props) => (props.isDone ? 'var(--color-gray3)' : 'var(--color-main)')};
`;

// 프로필 영역
export const ProfileSection = styled.div<{ horizonPadding?: string }>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 1.1rem ${(props) => props.horizonPadding ?? '0'};
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
`;

export const ProfileInfo = styled.div<{ height?: string; marginTop?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${(props) => props.marginTop && `margin-top: ${props.marginTop};`}
  width: 15rem;
  height: ${(props) => props.height ?? '3rem'};
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
