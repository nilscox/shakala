export {
  checkUserPassword,
  InvalidCredentialsError,
} from './commands/check-user-password/check-user-password';

export { createUser } from './commands/create-user/create-user';

export {
  validateUserEmail,
  InvalidEmailValidationTokenError,
} from './commands/validate-user-email/validate-user-email';

export { getUser, GetUserResult } from './queries/get-user';

export { UserModule } from './user.module';
