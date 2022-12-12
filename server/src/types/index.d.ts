import { Request } from 'express';

declare interface AuthorizedRequest extends Request {
  user?: {
    userIdx?: number;
    oauthType?: string;
    oauthEmail?: string;
  };
}

declare interface SignupRequest extends Request {
  files?: {
    profileImg: {
      name: string;
      data: Buffer;
      size: number;
      encoding: string;
      tempFilePath: string;
      truncated: boolean;
      mimetype: string;
      md5: string;
      mv: Function;
    };
  };
}

declare interface UpdateProfileRequest extends AuthorizedRequest, SignupRequest {}

declare interface PutEmoticonRequest extends AuthorizedRequest {
  emoticon?: number;
}
