import {
  BaseError,
  commandCreator,
  CommandHandler,
  DomainEvent,
  EventPublisher,
  registerCommand,
  TOKENS,
} from '@shakala/common';
import { injected } from 'brandi';

import { UserRepository } from '../../repositories/user.repository';
import { USER_TOKENS } from '../../tokens';

export type ValidateUserEmailCommand = {
  userId: string;
  emailValidationToken: string;
};

export const validateUserEmail = commandCreator<ValidateUserEmailCommand>('validateUserEmail');

export class ValidateUserEmailHandler implements CommandHandler<ValidateUserEmailCommand> {
  constructor(private readonly publisher: EventPublisher, private readonly userRepository: UserRepository) {}

  async handle(command: ValidateUserEmailCommand): Promise<void> {
    const { userId, emailValidationToken } = command;
    const user = await this.userRepository.findByIdOrFail(userId);

    if (!user.emailValidationToken) {
      throw new EmailAlreadyValidatedError(user.email);
    }

    if (emailValidationToken !== user.emailValidationToken) {
      throw new InvalidEmailValidationTokenError(user.email, emailValidationToken);
    }

    user.setEmailValidated();

    await this.userRepository.save(user);

    this.publisher.publish(new UserEmailValidatedEvent(user.id));
  }
}

injected(ValidateUserEmailHandler, TOKENS.publisher, USER_TOKENS.repositories.userRepository);
registerCommand(validateUserEmail, USER_TOKENS.commands.validateUserEmailHandler);

export class EmailAlreadyValidatedError extends BaseError<{ email: string }> {
  constructor(email: string) {
    super('Email address already validated', { email });
  }
}

export class InvalidEmailValidationTokenError extends BaseError<{ email: string; token: string }> {
  constructor(email: string, token: string) {
    super('Invalid email validation token', { email, token });
  }
}

export class UserEmailValidatedEvent extends DomainEvent {
  constructor(id: string) {
    super('User', id);
  }
}
