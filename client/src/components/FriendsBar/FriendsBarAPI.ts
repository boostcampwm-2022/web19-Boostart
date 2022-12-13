import axios, { Axios, AxiosResponse } from 'axios';
import { HOST, API_VERSION } from '../../constants';
import { authorizedHttpRequest } from '../common/utils';

//query
const fetchFriendList = async () => {
  const response = await axios.get(`${HOST}/api/v1/friend`);
  return response.data;
};

const fetchMyProfile = async () => {
  const response = await axios.get(`${HOST}/api/v1/user/me`);
  return response.data;
};

const fetchFriendRequests = async (): Promise<Friend[]> => {
  const response = await axios.get(`${HOST}/api/v1/friend/request`);
  return response.data;
};

const fetchLogoutRequest = async () => {
  await axios.get(`${HOST}/api/v1/auth/logout`);
  alert('로그아웃되었습니다');
  window.location.href = '/';
};

const sendFriendRequest = async (selectedFriend: number) => {
  await axios.put(`${HOST}/api/v1/friend/request/${selectedFriend}`);
};

//API

export const sendUnfriendRequest = async (friendIdx: number): Promise<boolean> => {
  try {
    await axios.delete(`${HOST}/${API_VERSION}/friend/${friendIdx}`);
    alert('친구를 삭제했습니다');
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const getFriendsList = async (): Promise<Friend[]> => {
  try {
    return authorizedHttpRequest(() => fetchFriendList());
  } catch (error) {
    throw error;
  }
};

export const getMyProfile = async () => {
  try {
    return authorizedHttpRequest(() => fetchMyProfile());
  } catch (error) {
    throw error;
  }
};

export const postFriendRequest = async (selectedFriend: number) => {
  try {
    const response = await authorizedHttpRequest(() => sendFriendRequest(selectedFriend));
    if (response.status === 201) alert('친구요청을 완료했습니다');
  } catch (error: any) {
    alert(error.response.data.msg);
  }
};

export const getFriendRequests = async (): Promise<Friend[]> => {
  try {
    return authorizedHttpRequest(() => fetchFriendRequests());
  } catch (error) {
    throw error;
  }
};

export const sendLogoutRequest = async () => {
  try {
    authorizedHttpRequest(() => fetchLogoutRequest());
  } catch (error) {
    throw error;
  }
};
