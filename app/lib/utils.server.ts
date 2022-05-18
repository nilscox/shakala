import container from '~/inversify.config.server';

import { SessionService, SessionServiceToken } from './session.service';

export const getUserId = (request: Request) => {
  return container.get<SessionService>(SessionServiceToken).getUserId(request);
};
