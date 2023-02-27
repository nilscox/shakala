import { SetupListeners } from '@shakala/common';

import { UserCreatedEvent } from './commands/create-user/create-user';
import { USER_TOKENS } from './tokens';

export const setupUserListeners: SetupListeners = (bind) => {
  bind(UserCreatedEvent, USER_TOKENS.sendEmailToCreatedUserHandler);
};
