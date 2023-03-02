import { Module } from '@shakala/common';

import { CheckUserPasswordHandler } from './commands/check-user-password/check-user-password';
import { CreateUserHandler, UserCreatedEvent } from './commands/create-user/create-user';
import { ValidateUserEmailHandler } from './commands/validate-user-email/validate-user-email';
import { SendEmailToCreatedUserHandler } from './event-handlers/send-email-to-created-user/send-email-to-created-user';
import { GetUserHandler } from './queries/get-user';
import { FilesystemUserRepository } from './repositories/file-system-user.repository';
import { USER_TOKENS } from './tokens';

export class UserModule extends Module {
  async init() {
    this.bindToken(USER_TOKENS.userRepository, FilesystemUserRepository);
    // this.bindToken(USER_TOKENS.userRepository, InMemoryUserRepository);
    this.bindToken(USER_TOKENS.createUserHandler, CreateUserHandler);
    this.bindToken(USER_TOKENS.checkUserPasswordHandler, CheckUserPasswordHandler);
    this.bindToken(USER_TOKENS.validateUserEmailHandler, ValidateUserEmailHandler);
    this.bindToken(USER_TOKENS.sendEmailToCreatedUserHandler, SendEmailToCreatedUserHandler);
    this.bindToken(USER_TOKENS.getUserHandler, GetUserHandler);

    this.registerCommandHandler(USER_TOKENS.checkUserPasswordHandler);
    this.registerCommandHandler(USER_TOKENS.createUserHandler);
    this.registerCommandHandler(USER_TOKENS.validateUserEmailHandler);

    this.registerQueryHandler(USER_TOKENS.getUserHandler);

    this.bindEventListener(UserCreatedEvent, USER_TOKENS.sendEmailToCreatedUserHandler);
  }
}
