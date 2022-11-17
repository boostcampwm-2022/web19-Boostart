import { Request } from 'express';

declare interface AuthorizedRequest extends Request {
  user?: {
    userIdx?: number;
    oauthType?: string;
    oauthEmail?: string;
  };
}
