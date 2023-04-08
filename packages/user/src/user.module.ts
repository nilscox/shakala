import { Module } from '@shakala/common';
import { Container } from 'brandi';

import { GravatarProfileImageAdapter } from './adapters/profile-image/gravatar-profile-image.adapter';
import { CheckUserPasswordHandler } from './commands/check-user-password/check-user-password';
import { CreateUserHandler } from './commands/create-user/create-user';
import { CreateUserActivityHandler } from './commands/create-user-activity/create-user-activity';
import { ValidateUserEmailHandler } from './commands/validate-user-email/validate-user-email';
import { UserUserActivitiesHandler } from './event-handlers/create-user-activities/user-user-activities';
import { SendEmailToCreatedUserHandler } from './event-handlers/send-email-to-created-user/send-email-to-created-user';
import { GetProfileImageHandler } from './queries/get-profile-image';
import { GetUserHandler } from './queries/get-user';
import { ListUserActivitiesHandler } from './queries/list-user-activities';
import { ListUsersHandler } from './queries/list-users';
import { SqlUserRepository } from './repositories/user/sql-user.repository';
import { SqlUserActivityRepository } from './repositories/user-activity/sql-user-activity.repository';
import { USER_TOKENS } from './tokens';

class UserModule extends Module {
  init(container: Container) {
    this.expose(container, USER_TOKENS.commands);
    this.expose(container, USER_TOKENS.queries);
    this.expose(container, USER_TOKENS.eventHandlers);
  }
}

export const module = new UserModule();

module.bind(USER_TOKENS.repositories.userRepository).toInstance(SqlUserRepository).inSingletonScope();
module.bind(USER_TOKENS.repositories.userActivityRepository).toInstance(SqlUserActivityRepository).inSingletonScope();

module.bind(USER_TOKENS.adapters.profileImage).toInstance(GravatarProfileImageAdapter).inSingletonScope();

module.bind(USER_TOKENS.commands.createUserHandler).toInstance(CreateUserHandler).inSingletonScope();
module.bind(USER_TOKENS.commands.createUserActivityHandler).toInstance(CreateUserActivityHandler).inSingletonScope();
module.bind(USER_TOKENS.commands.checkUserPasswordHandler).toInstance(CheckUserPasswordHandler).inSingletonScope();
module.bind(USER_TOKENS.commands.validateUserEmailHandler).toInstance(ValidateUserEmailHandler).inSingletonScope();

module.bind(USER_TOKENS.queries.listUsersHandler).toInstance(ListUsersHandler).inSingletonScope();
module.bind(USER_TOKENS.queries.listUserActivitiesHandler).toInstance(ListUserActivitiesHandler).inSingletonScope();
module.bind(USER_TOKENS.queries.getUserHandler).toInstance(GetUserHandler).inSingletonScope();
module.bind(USER_TOKENS.queries.getProfileImageHandler).toInstance(GetProfileImageHandler).inSingletonScope();

module.bind(USER_TOKENS.eventHandlers.userUserActivitiesHandler).toInstance(UserUserActivitiesHandler).inSingletonScope();
module.bind(USER_TOKENS.eventHandlers.sendEmailToCreatedUserHandler).toInstance(SendEmailToCreatedUserHandler).inSingletonScope();
