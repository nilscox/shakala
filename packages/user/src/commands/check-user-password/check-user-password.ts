import { BaseError, CommandHandler, CryptoPort } from '@shakala/common';

import { UserRepository } from '../../repositories/user.repository';

export class InvalidCredentialsError extends BaseError {
  constructor() {
    super('Invalid credentials');
  }
}

type CheckUserPasswordDeps = {
  crypto: CryptoPort;
  userRepository: UserRepository;
};

type CheckUserPasswordCommand = {
  email: string;
  password: string;
};

export const checkUserPassword: CommandHandler<CheckUserPasswordDeps, CheckUserPasswordCommand> = async (
  { userRepository, crypto },
  { email, password }
) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new InvalidCredentialsError();
  }

  const match = await crypto.compare(user?.hashedPassword, password);

  if (!match) {
    throw new InvalidCredentialsError();
  }
};
