import styled from 'styled-components';

export const DrawerContainer = styled.div`
  width: 25rem;
  z-index: 1000;
  height: 100%;
  position: absolute;
  top: 0px;
  right: 0px;
  background-color: whitesmoke;
`;

export const ProfileSectionContainer = styled.div`
  display: flex;
`;

export const ReceivedFriendRequestSectionContainer = styled.div`
  display: flex;
`;

export const Dimmed = styled.div`
  z-index: 999;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  background-color: black;
`;

export const LogoutButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
`;
