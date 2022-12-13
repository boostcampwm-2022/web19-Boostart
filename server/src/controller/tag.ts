import { Response } from 'express';
import { AuthorizedRequest } from '../types';
import { API_VERSION } from '../constants';
import * as Tag from '../model/tag';
import * as User from '../model/user';
import * as Friend from '../model/friend';

export const getAllTags = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;

  try {
    const tags = await Tag.getAllTags(userIdx);
    res.json(tags);
  } catch {
    res.sendStatus(500);
  }
};

export const getAllFriendsTags = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;
  const { user_id: friendId } = req.params;

  try {
    const friendIdx = await User.getIdxByUserId(friendId);
    if (!friendIdx) return res.status(404).send({ msg: '존재하지 않는 사용자예요.' });
    if (userIdx === friendIdx) return res.redirect(`/api/${API_VERSION}/tag`);

    const existFriend = await Friend.existFriend(userIdx, friendIdx);
    if (!existFriend) return res.status(403).send({ msg: '친구가 아닌 사용자의 태그를 조회할 수 없어요.' });

    const tags = await Tag.getAllTags(friendIdx);
    res.json(tags);
  } catch {
    res.sendStatus(500);
  }
};

export const createTag = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;
  const { title, color } = req.body;

  try {
    const tagIdx = await Tag.createTag(userIdx, title, color);
    res.status(200).send({ idx: tagIdx });
  } catch {
    res.sendStatus(409);
  }
};

export const updateTagColor = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;
  const tagIdx = parseInt(req.params.tag_idx);
  const { color } = req.body;

  try {
    await Tag.updateTag(userIdx, tagIdx, color);
    res.sendStatus(200);
  } catch {
    res.sendStatus(403);
  }
};

export const deleteTag = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;
  const tagIdx = parseInt(req.params.tag_idx);

  try {
    const existTag = await Tag.existTag(userIdx, tagIdx);
    if (!existTag) return res.status(404).json({ msg: '존재하지 않는 태그예요.' });

    const tagUsageCount = await Tag.getTagUsageCount(tagIdx);
    if (tagUsageCount > 0) return res.status(409).json({ msg: '사용 중인 태그는 삭제할 수 없어요.' });

    await Tag.deleteTag(userIdx, tagIdx);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};
