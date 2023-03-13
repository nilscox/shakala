import { token } from 'brandi';

import { CheckUserPasswordHandler } from './commands/check-user-password/check-user-password';
import { CreateUserHandler } from './commands/create-user/create-user';
import { CreateUserActivityHandler } from './commands/create-user-activity/create-user-activity';
import { ValidateUserEmailHandler } from './commands/validate-user-email/validate-user-email';
import { UserUserActivitiesHandler } from './event-handlers/create-user-activities/user-user-activities';
import { SendEmailToCreatedUserHandler } from './event-handlers/send-email-to-created-user/send-email-to-created-user';
import { GetUserHandler } from './queries/get-user';
import { ListUserActivitiesHandler } from './queries/list-user-activities';
import { ListUsersHandler } from './queries/list-users';
import { UserRepository } from './repositories/user/user.repository';
import { UserActivityRepository } from './repositories/user-activity/user-activity.repository';

export const USER_TOKENS = {
  repositories: {
    userRepository: token<UserRepository>('userRepository'),
    userActivityRepository: token<UserActivityRepository>('userActivityRepository'),
  },
  commands: {
    createUserHandler: token<CreateUserHandler>('createUserHandler'),
    createUserActivityHandler: token<CreateUserActivityHandler>('createUserActivityHandler'),
    checkUserPasswordHandler: token<CheckUserPasswordHandler>('checkUserPasswordHandler'),
    validateUserEmailHandler: token<ValidateUserEmailHandler>('validateUserEmailHandler'),
  },
  queries: {
    listUsersHandler: token<ListUsersHandler>('listUsersHandler'),
    listUserActivitiesHandler: token<ListUserActivitiesHandler>('listUserActivitiesHandler'),
    getUserHandler: token<GetUserHandler>('getUserHandler'),
  },
  eventHandlers: {
    userUserActivitiesHandler: token<UserUserActivitiesHandler>('createUserActivitiesHandler'),
    sendEmailToCreatedUserHandler: token<SendEmailToCreatedUserHandler>('sendEmailToCreatedUserHandler'),
  },
};
