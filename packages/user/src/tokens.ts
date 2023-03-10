import { token } from 'brandi';

import { CheckUserPasswordHandler } from './commands/check-user-password/check-user-password';
import { CreateUserHandler } from './commands/create-user/create-user';
import { ValidateUserEmailHandler } from './commands/validate-user-email/validate-user-email';
import { SendEmailToCreatedUserHandler } from './event-handlers/send-email-to-created-user/send-email-to-created-user';
import { GetUserHandler } from './queries/get-user';
import { ListUsersHandler } from './queries/list-users';
import { UserRepository } from './repositories/user.repository';

export const USER_TOKENS = {
  repositories: {
    userRepository: token<UserRepository>('userRepository'),
  },
  commands: {
    createUserHandler: token<CreateUserHandler>('createUserHandler'),
    checkUserPasswordHandler: token<CheckUserPasswordHandler>('checkUserPasswordHandler'),
    validateUserEmailHandler: token<ValidateUserEmailHandler>('validateUserEmailHandler'),
  },
  queries: {
    listUsersHandler: token<ListUsersHandler>('listUsersHandler'),
    getUserHandler: token<GetUserHandler>('getUserHandler'),
  },
  eventHandlers: {
    sendEmailToCreatedUserHandler: token<SendEmailToCreatedUserHandler>('sendEmailToCreatedUserHandler'),
  },
};
