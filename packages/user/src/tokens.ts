import { token } from 'brandi';

import { CheckUserPasswordHandler } from './commands/check-user-password/check-user-password';
import { CreateUserHandler } from './commands/create-user/create-user';
import { ValidateUserEmailHandler } from './commands/validate-user-email/validate-user-email';
import { SendEmailToCreatedUserHandler } from './event-handlers/send-email-to-created-user/send-email-to-created-user';
import { UserRepository } from './repositories/user.repository';

export const USER_TOKENS = {
  userRepository: token<UserRepository>('userRepository'),
  createUserHandler: token<CreateUserHandler>('createUserHandler'),
  checkUserPasswordHandler: token<CheckUserPasswordHandler>('checkUserPasswordHandler'),
  validateUserEmailHandler: token<ValidateUserEmailHandler>('validateUserEmailHandler'),
  sendEmailToCreatedUserHandler: token<SendEmailToCreatedUserHandler>('sendEmailToCreatedUserHandler'),
};
