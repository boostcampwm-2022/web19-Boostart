import { Request } from 'express';

declare interface AuthorizedRequest extends Request {
  user?: {
    userId?: string;
    oauthType?: string;
    oauthEmail?: string;
  };
}
