import { Response } from 'express';
import { AuthorizedRequest } from '../types';
import * as Friend from '../model/friend';
import * as User from '../model/user';

export const getAllFriends = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;

  try {
    const friends = await Friend.getAllFriends(userIdx);
    res.json(friends);
  } catch {
    res.sendStatus(500);
  }
};

export const deleteFriend = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;
  const friendIdx = parseInt(req.params.user_idx);

  try {
    const deleted = await Friend.deleteFriend(userIdx, friendIdx);
    if (!deleted) return res.status(404).json({ msg: '존재하지 않는 친구예요.' });
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
};

export const getAllFriendRequests = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;

  try {
    const friendRequests = await Friend.getAllFriendRequests(userIdx);
    res.json(friendRequests);
  } catch {
    res.sendStatus(500);
  }
};

export const sendFriendRequest = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;
  const friendIdx = parseInt(req.params.user_idx);

  if (userIdx === friendIdx) return res.status(409).json({ msg: '스스로에게 친구 요청을 할 수 없어요.' });

  const existUser = await User.existUser(friendIdx);
  if (!existUser) return res.status(404).json({ msg: '존재하지 않는 사용자예요.' });

  try {
    const friendRequest = await Friend.getFriendRequest(userIdx, friendIdx);
    if (!friendRequest) {
      await Friend.createFriendRequest(userIdx, friendIdx);
      return res.sendStatus(201);
    }

    const { sender_idx: senderIdx, accepted } = friendRequest;

    if (accepted) return res.status(409).json({ msg: '이미 친구예요.' });
    if (senderIdx === userIdx) return res.status(409).json({ msg: '이미 친구 요청을 보냈어요.' });

    await Friend.acceptFriendRequest(userIdx, friendIdx);
    return res.status(200).json({ msg: '이미 나에게 친구 요청을 보낸 사용자예요. 자동으로 친구가 되었어요.' });
  } catch {
    res.sendStatus(500);
  }
};

export const acceptFriendRequest = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;
  const friendIdx = parseInt(req.params.user_idx);

  try {
    const accepted = await Friend.acceptFriendRequest(userIdx, friendIdx);
    if (!accepted) return res.status(404).json({ msg: '존재하지 않는 친구 요청이에요.' });
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
};

export const refuseFriendRequest = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;
  const friendIdx = parseInt(req.params.user_idx);

  try {
    const refused = await Friend.refuseFriendRequest(userIdx, friendIdx);
    if (!refused) return res.status(404).json({ msg: '존재하지 않는 친구 요청이에요.' });
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
};
