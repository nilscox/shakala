import { User } from 'backend-domain';

import { Request } from '../../http/request';

export interface SessionPort {
  getUser(request: Request): Promise<User | undefined>;
  setUser(request: Request, user: User): void;
  unsetUser(request: Request): Promise<void>;
}
