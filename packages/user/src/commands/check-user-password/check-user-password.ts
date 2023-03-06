import {
  BaseError,
  commandCreator,
  CommandHandler,
  CryptoPort,
  registerCommand,
  TOKENS,
} from '@shakala/common';
import { injected } from 'brandi';

import { UserRepository } from '../../repositories/user.repository';
import { USER_TOKENS } from '../../tokens';

export type CheckUserPasswordCommand = {
  email: string;
  password: string;
};

export const checkUserPassword = commandCreator<CheckUserPasswordCommand>('checkUserPassword');

export class CheckUserPasswordHandler implements CommandHandler<CheckUserPasswordCommand> {
  constructor(private readonly crypto: CryptoPort, private readonly userRepository: UserRepository) {}

  async handle(command: CheckUserPasswordCommand): Promise<void> {
    const { email, password } = command;

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const match = await this.crypto.compare(user?.hashedPassword, password);

    if (!match) {
      throw new InvalidCredentialsError();
    }
  }
}

injected(CheckUserPasswordHandler, TOKENS.crypto, USER_TOKENS.repositories.userRepository);
registerCommand(checkUserPassword, USER_TOKENS.commands.checkUserPasswordHandler);

export class InvalidCredentialsError extends BaseError {
  constructor() {
    super('Invalid credentials');
  }
}
