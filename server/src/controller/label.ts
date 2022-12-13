import { Response } from 'express';
import { AuthorizedRequest } from '../types';
import { API_VERSION } from '../constants';
import * as Label from '../model/label';
import * as User from '../model/user';
import * as Friend from '../model/friend';

export const getAllLabels = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;

  try {
    const labels = await Label.getAllLabelsByUserIdx(userIdx);
    res.json(labels);
  } catch {
    res.sendStatus(500);
  }
};

export const getAllFriendsLabels = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;
  const { user_id: friendId } = req.params;

  try {
    const friendIdx = await User.getIdxByUserId(friendId);
    if (!friendIdx) return res.status(404).send({ msg: '존재하지 않는 사용자예요.' });
    if (userIdx === friendIdx) return res.redirect(`/api/${API_VERSION}/label`);

    const existFriend = await Friend.existFriend(userIdx, friendIdx);
    if (!existFriend) return res.status(403).send({ msg: '친구가 아닌 사용자의 라벨을 조회할 수 없어요.' });

    const labels = await Label.getAllLabelsByUserIdx(friendIdx);
    res.json(labels);
  } catch {
    res.sendStatus(500);
  }
};

const LabelBodyKeys = {
  title: 'title',
  color: 'color',
  unit: 'unit',
} as const;

type LabelBodyKeys = typeof LabelBodyKeys[keyof typeof LabelBodyKeys];

const validate = (key: LabelBodyKeys, value: string) => {
  switch (key) {
    case LabelBodyKeys.title: {
      if (!(value && typeof value === 'string')) throw new ValidationError('올바른 제목을 입력해주세요.');
      return true;
    }
    case LabelBodyKeys.unit: {
      if (!(value && typeof value === 'string')) throw new ValidationError('올바른 단위를 입력해주세요.');
      return true;
    }
    case LabelBodyKeys.color: {
      const regex = /^#[A-Fa-f0-9]{6}$/;
      if (!regex.test(value)) throw new ValidationError('올바른 색상을 입력해주세요.');
      return true;
    }
    default: {
      throw new ValidationError('잘못된 정보가 입력되었어요.');
    }
  }
};

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const createLabel = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;

  try {
    Object.values(LabelBodyKeys).forEach((key) => {
      validate(key, req.body[key]);
    });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }

  const { title, color, unit } = req.body;

  try {
    const labelTitleAlreadyExists = await Label.existLabelByTitle(userIdx, title);
    if (labelTitleAlreadyExists) return res.status(409).json({ msg: '이미 존재하는 라벨이에요.' });

    const tagIdx = await Label.createLabel(userIdx, title, color, unit);
    res.status(201).send({ idx: tagIdx });
  } catch {
    res.sendStatus(500);
  }
};

export const updateLabel = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;
  const labelIdx = parseInt(req.params.label_idx);
  let { title, color } = req.body;

  try {
    const label = await Label.getLabelByIdx(labelIdx);
    if (!label || label.user_idx !== userIdx) return res.status(404).json({ msg: '존재하지 않는 라벨이에요.' });

    let status = 200;

    if (title) {
      const labelTitleAlreadyExists = await Label.existLabelByTitle(userIdx, title);
      if (labelTitleAlreadyExists && label.title !== title) {
        status = 409;
        title = undefined;
      }
    }
    if (color && status === 409) status = 206;

    if (status !== 409 && (title || color)) {
      await Label.updateLabel(labelIdx, [
        { column: 'title', value: title },
        { column: 'color', value: color },
      ]);
    }
    res.sendStatus(status);
  } catch (error) {
    res.sendStatus(500);
  }
};

export const deleteLabel = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;
  const labelIdx = parseInt(req.params.label_idx);

  try {
    const existLabel = await Label.existLabelByIdx(userIdx, labelIdx);
    if (!existLabel) return res.status(404).json({ msg: '존재하지 않는 라벨이에요.' });

    const labelUsageCount = await Label.getLabelUsageCountByIdx(labelIdx);
    if (labelUsageCount > 0) return res.status(409).json({ msg: '사용 중인 라벨은 삭제할 수 없어요.' });

    await Label.deleteLabel(labelIdx);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};
