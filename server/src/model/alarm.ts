import { executeSql } from '../db';

export const getAllAlarms = async (userIdx: number) => {
  return await executeSql('select * from alarm where receiver_idx = ? and status = false', [userIdx]);
};
