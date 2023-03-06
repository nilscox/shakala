import { Module } from '@shakala/common';

import { CheckUserPasswordHandler } from './commands/check-user-password/check-user-password';
import { CreateUserHandler, UserCreatedEvent } from './commands/create-user/create-user';
import { ValidateUserEmailHandler } from './commands/validate-user-email/validate-user-email';
import { SendEmailToCreatedUserHandler } from './event-handlers/send-email-to-created-user/send-email-to-created-user';
import { GetUserHandler } from './queries/get-user';
import { FilesystemUserRepository } from './repositories/file-system-user.repository';
import { InMemoryUserRepository } from './repositories/in-memory-user.repository';
import { USER_TOKENS } from './tokens';

type ThreadModuleConfig = {
  repositories: 'memory' | 'filesystem';
};

export class UserModule extends Module {
  configure(config: ThreadModuleConfig) {
    if (config.repositories === 'memory') {
      this.bindToken(USER_TOKENS.repositories.userRepository, InMemoryUserRepository);
    } else {
      this.bindToken(USER_TOKENS.repositories.userRepository, FilesystemUserRepository);
    }

    this.bindToken(USER_TOKENS.commands.createUserHandler, CreateUserHandler);
    this.bindToken(USER_TOKENS.commands.checkUserPasswordHandler, CheckUserPasswordHandler);
    this.bindToken(USER_TOKENS.commands.validateUserEmailHandler, ValidateUserEmailHandler);

    this.bindToken(USER_TOKENS.queries.getUserHandler, GetUserHandler);

    this.bindToken(USER_TOKENS.eventHandlers.sendEmailToCreatedUserHandler, SendEmailToCreatedUserHandler);
    this.bindEventListener(UserCreatedEvent, USER_TOKENS.eventHandlers.sendEmailToCreatedUserHandler);
  }
}
