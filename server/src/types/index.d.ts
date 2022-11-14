import { Request } from 'express';

declare interface AuthorizedRequest extends Request {
  user?: string;
}
