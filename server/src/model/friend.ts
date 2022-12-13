import { RowDataPacket } from 'mysql2';
import { executeSql } from '../db';

export const existFriend = async (userIdx: number, friendIdx: number) => {
  return ((await executeSql('select * from friendship where (sender_idx = ? and receiver_idx = ?) or (sender_idx = ? and receiver_idx = ?)', [userIdx, friendIdx, friendIdx, userIdx])) as RowDataPacket).length > 0;
};

export const getAllFriends = async (userIdx: number) => {
  return executeSql('select idx, user_id as userId, username, profile_img as profileImg from user inner join friendship on idx = sender_idx or idx = receiver_idx where idx != ? and (receiver_idx = ? or sender_idx = ?) and accepted = true', [
    userIdx,
    userIdx,
    userIdx,
  ]);
};

export const deleteFriend = async (userIdx: number, friendIdx: number): Promise<boolean> => {
  const { affectedRows } = (await executeSql('delete from friendship where ((sender_idx = ? and receiver_idx = ?) or (sender_idx = ? and receiver_idx = ?)) and accepted = true', [userIdx, friendIdx, friendIdx, userIdx])) as RowDataPacket;
  return affectedRows > 0;
};

export const getAllFriendRequests = async (userIdx: number) => {
  return await executeSql('select idx, user_id as userId, username, profile_img as profileImg from user inner join friendship on idx = sender_idx where receiver_idx = ? and accepted = false', [userIdx]);
};

export const getFriendRequest = async (userIdx: number, friendIdx: number) => {
  return ((await executeSql('select * from friendship where (sender_idx = ? and receiver_idx = ?) or (sender_idx = ? and receiver_idx = ?)', [userIdx, friendIdx, friendIdx, userIdx])) as RowDataPacket)[0];
};

export const createFriendRequest = async (userIdx: number, friendIdx: number) => {
  await executeSql('insert into friendship (sender_idx, receiver_idx, accepted) values (?, ?, false)', [userIdx, friendIdx]);
};

export const acceptFriendRequest = async (userIdx: number, friendIdx: number): Promise<boolean> => {
  const { affectedRows } = (await executeSql('update friendship set accepted = true where sender_idx = ? and receiver_idx = ? and accepted = false', [friendIdx, userIdx])) as RowDataPacket;
  return affectedRows > 0;
};

export const refuseFriendRequest = async (userIdx: number, friendIdx: number): Promise<boolean> => {
  const { affectedRows } = (await executeSql('delete from friendship where receiver_idx = ? and sender_idx = ? and accepted = false', [userIdx, friendIdx])) as RowDataPacket;
  return affectedRows > 0;
};
