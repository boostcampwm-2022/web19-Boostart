import { RowDataPacket } from 'mysql2';
import { executeSql } from '../db';
import { setSetSyntax } from './util';

export const existUser = async (userIdx: number) => {
  return ((await executeSql('select idx from user where idx = ?', [userIdx])) as RowDataPacket).length > 0;
};

export const checkLoginInformation = async (userId: string, password: string) => {
  const user = ((await executeSql('select idx from user where user_id = ? and password = ?', [userId, password])) as RowDataPacket)[0];
  const { idx } = user || {};
  return idx;
};

export const getUserByIdx = async (userIdx: number) => {
  const [user] = (await executeSql('select user_id as userId, username, profile_img as profileImg from user where idx = ?', [userIdx])) as RowDataPacket[];
  return user;
};

export const getUserByUserId = async (userId: string) => {
  const user = ((await executeSql('select * from user where user_id = ?', [userId])) as RowDataPacket)[0];
  return user;
};

export const getIdxByUserId = async (userId: string) => {
  const user = ((await executeSql('select idx from user where user_id = ?', [userId])) as RowDataPacket)[0];
  const { idx } = user || {};
  return idx;
};

export const getIdxByOAuth = async (oauthType: string, oauthEmail: string) => {
  const user = ((await executeSql('select idx from user where oauth_type = ? and oauth_email = ?', [oauthType, oauthEmail])) as RowDataPacket)[0];
  const { idx } = user || {};
  return idx;
};

export const findAllUsersByUserId = async (userIdx: number, userId: string) => {
  return await executeSql('select idx, user_id as userId, username, profile_img as profileImg from user where idx != ? and user_id LIKE ?', [userIdx, `%${userId}%`]);
};

export const createUser = async (userId: string, password: string, username: string, profileImgFilename: string, oauthType: string, oauthEmail: string, salt: string) => {
  await (oauthType
    ? executeSql('insert into `user` (user_id, password, username, profile_img, oauth_type, oauth_email, salt) values (?, ?, ?, ?, ?, ?, ?)', [userId, password, username, profileImgFilename, oauthType, oauthEmail, salt])
    : executeSql('insert into `user` (user_id, password, username, profile_img, salt) values (?, ?, ?, ?, ?)', [userId, password, username, profileImgFilename, salt]));
};

export const updateUser = async (userIdx: number, columnValueList: { column: string; value: any }[]) => {
  const updateValues = [];
  const updateSql = `update user ${setSetSyntax(columnValueList, updateValues)} where idx = ?`;
  updateValues.push(userIdx);
  await executeSql(updateSql, updateValues);
};
