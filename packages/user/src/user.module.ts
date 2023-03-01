import { Module } from '@shakala/common';

import { CheckUserPasswordHandler } from './commands/check-user-password/check-user-password';
import { CreateUserHandler, UserCreatedEvent } from './commands/create-user/create-user';
import { ValidateUserEmailHandler } from './commands/validate-user-email/validate-user-email';
import { SendEmailToCreatedUserHandler } from './event-handlers/send-email-to-created-user/send-email-to-created-user';
import { FilesystemUserRepository } from './repositories/file-system-user.repository';
import { USER_TOKENS } from './tokens';

export class UserModule extends Module {
  async init() {
    const container = this.container;

    this.bindToken(USER_TOKENS.userRepository, FilesystemUserRepository);
    // this.bindTo(USER_TOKENS.userRepository, InMemoryUserRepository);
    this.bindToken(USER_TOKENS.createUserHandler, CreateUserHandler);
    this.bindToken(USER_TOKENS.checkUserPasswordHandler, CheckUserPasswordHandler);
    this.bindToken(USER_TOKENS.validateUserEmailHandler, ValidateUserEmailHandler);
    this.bindToken(USER_TOKENS.sendEmailToCreatedUserHandler, SendEmailToCreatedUserHandler);

    container.use(USER_TOKENS.createUserHandler).from(this);
    container.use(USER_TOKENS.checkUserPasswordHandler).from(this);
    container.use(USER_TOKENS.validateUserEmailHandler).from(this);
    container.use(USER_TOKENS.sendEmailToCreatedUserHandler).from(this);

    this.registerCommandHandler(USER_TOKENS.checkUserPasswordHandler);
    this.registerCommandHandler(USER_TOKENS.createUserHandler);
    this.registerCommandHandler(USER_TOKENS.validateUserEmailHandler);

    this.bindEventListener(UserCreatedEvent, USER_TOKENS.sendEmailToCreatedUserHandler);
  }
}
