import { Module } from '@shakala/common';

import { GravatarProfileImageAdapter } from './adapters/gravatar-profile-image.adapter';
import { CheckUserPasswordHandler } from './commands/check-user-password/check-user-password';
import { CreateUserHandler } from './commands/create-user/create-user';
import { CreateUserActivityHandler } from './commands/create-user-activity/create-user-activity';
import { ValidateUserEmailHandler } from './commands/validate-user-email/validate-user-email';
import { UserUserActivitiesHandler } from './event-handlers/create-user-activities/user-user-activities';
import { SendEmailToCreatedUserHandler } from './event-handlers/send-email-to-created-user/send-email-to-created-user';
import { GetUserHandler } from './queries/get-user';
import { ListUserActivitiesHandler } from './queries/list-user-activities';
import { ListUsersHandler } from './queries/list-users';
import { FilesystemUserRepository } from './repositories/user/file-system-user.repository';
import { InMemoryUserRepository } from './repositories/user/in-memory-user.repository';
import { SqlUserRepository } from './repositories/user/sql-user.repository';
import { FilesystemUserActivityRepository } from './repositories/user-activity/file-system-user-activity.repository';
import { InMemoryUserActivityRepository } from './repositories/user-activity/in-memory-user-activity.repository';
import { USER_TOKENS } from './tokens';

type ThreadModuleConfig = {
  repositories: 'memory' | 'filesystem' | 'sql';
};

export class UserModule extends Module {
  configure(config: ThreadModuleConfig) {
    if (config.repositories === 'memory') {
      this.bindToken(USER_TOKENS.repositories.userRepository, InMemoryUserRepository, false);
      this.bindToken(USER_TOKENS.repositories.userActivityRepository, InMemoryUserActivityRepository, false);
    } else if (config.repositories === 'filesystem') {
      this.bindToken(USER_TOKENS.repositories.userRepository, FilesystemUserRepository, false);
      // prettier-ignore
      this.bindToken(USER_TOKENS.repositories.userActivityRepository, FilesystemUserActivityRepository, false);
    } else {
      this.bindToken(USER_TOKENS.repositories.userRepository, SqlUserRepository, true);
      // prettier-ignore
      this.bindToken(USER_TOKENS.repositories.userActivityRepository, FilesystemUserActivityRepository, false);
    }

    this.bindToken(USER_TOKENS.adapters.profileImage, GravatarProfileImageAdapter);

    this.bindToken(USER_TOKENS.commands.createUserHandler, CreateUserHandler);
    this.bindToken(USER_TOKENS.commands.createUserActivityHandler, CreateUserActivityHandler);
    this.bindToken(USER_TOKENS.commands.checkUserPasswordHandler, CheckUserPasswordHandler);
    this.bindToken(USER_TOKENS.commands.validateUserEmailHandler, ValidateUserEmailHandler);

    this.bindToken(USER_TOKENS.queries.listUsersHandler, ListUsersHandler);
    this.bindToken(USER_TOKENS.queries.listUserActivitiesHandler, ListUserActivitiesHandler);
    this.bindToken(USER_TOKENS.queries.getUserHandler, GetUserHandler);

    this.bindToken(USER_TOKENS.eventHandlers.userUserActivitiesHandler, UserUserActivitiesHandler);
    this.bindToken(USER_TOKENS.eventHandlers.sendEmailToCreatedUserHandler, SendEmailToCreatedUserHandler);
  }
}
