import styled from 'styled-components';

export const DRAWER_WIDTH = '25rem';
export const DRAWER_HEIGHT = '100vh';

export const DRAWER_Z_INDEX = 999;
export const DRAWER_TOP = '0';
export const DRAWER_RIGHT = '0';

export const DrawerContainer = styled.div<{ open: boolean }>`
  position: fixed;
  z-index: ${DRAWER_Z_INDEX};
  top: 0;
  right: -25rem;
  width: ${DRAWER_WIDTH};
  height: ${DRAWER_HEIGHT};
  background-color: whitesmoke;
  transition: all ease 1s;
  ${(props) => props.open && 'transform: translateX(-25rem);'}
`;

export const ProfileSectionContainer = styled.div`
  display: flex;
`;

export const ReceivedFriendRequestSectionContainer = styled.div`
  display: flex;
`;

export const LogoutButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
`;

export const ProfileEditButton = styled.button``;

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
