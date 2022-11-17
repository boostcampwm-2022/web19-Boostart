import { Request } from 'express';

declare interface AuthorizedRequest extends Request {
  user?: {
    userIdx?: string;
    oauthType?: string;
    oauthEmail?: string;
  };
}
