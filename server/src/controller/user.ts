import { Response } from 'express';
import fs from 'fs';
import { AuthorizedRequest, UpdateProfileRequest } from '../types';
import { DEFAULT_PROFILE } from '../constants';
import * as User from '../model/user';

export const getMyInfo = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;

  try {
    const user = await User.getUserByIdx(userIdx);
    res.json(user);
  } catch {
    res.sendStatus(500);
  }
};

export const findAllUsersByUserId = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;
  const userId = req.query.user_id as string;

  try {
    const users = await User.findAllUsersByUserId(userIdx, userId);
    res.json(users);
  } catch {
    res.sendStatus(500);
  }
};

export const updateMyInfo = async (req: UpdateProfileRequest, res: Response) => {
  const { userIdx } = req.user;
  const { username } = req.body;

  if (!username) return res.status(400).json({ msg: '올바른 정보를 입력해주세요.' });
  const columnValueList = [{ column: 'username', value: username }];

  if (req.files) {
    const { profileImg: currentProfileImg } = await User.getUserByIdx(userIdx);
    if (currentProfileImg !== DEFAULT_PROFILE && fs.existsSync(`./uploads/${currentProfileImg}`)) fs.rmSync(`./uploads/${currentProfileImg}`);

    const { profileImg } = req.files;
    const profileImgFilename = profileImg.name; // TODO: 해시하기
    profileImg.mv('./uploads/' + profileImgFilename);
    columnValueList.push({ column: 'profile_img', value: profileImgFilename });
  }

  try {
    await User.updateUser(userIdx, columnValueList);
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
};

// const { userIdx } = req.user;
// let { username, profileImg } = req.body;

// if (!username || profileImg === undefined) return res.status(400).json({ msg: '올바른 정보를 입력해주세요.' });
// if (!profileImg) profileImg = DEFAULT_PROFILE;

// try {
//   await User.updateUser(userIdx, username, profileImg);
//   res.sendStatus(200);
// } catch {
//   res.sendStatus(500);
// }
