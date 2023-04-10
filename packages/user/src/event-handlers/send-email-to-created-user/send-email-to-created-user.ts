import assert from 'assert';

import { CommandBus, ConfigPort, EventHandler, registerEventHandler, TOKENS } from '@shakala/common';
import { EmailKind, sendEmail } from '@shakala/email';
import { injected } from 'brandi';

import { UserCreatedEvent } from '../../commands/create-user/create-user';
import { UserRepository } from '../../repositories/user/user.repository';
import { USER_TOKENS } from '../../tokens';

export class SendEmailToCreatedUserHandler implements EventHandler<UserCreatedEvent> {
  constructor(
    private readonly config: ConfigPort,
    private readonly commandBus: CommandBus,
    private readonly userRepository: UserRepository
  ) {}

  async handle(event: UserCreatedEvent): Promise<void> {
    const user = await this.userRepository.findByIdOrFail(event.id);

    assert(user.emailValidationToken, 'user has no email validation token');

    const { appBaseUrl } = this.config.app;
    const emailValidationLink = `${appBaseUrl}/?email-validation-token=${user.emailValidationToken}`;

    const command = sendEmail({
      kind: EmailKind.welcome,
      to: user.email,
      payload: {
        appBaseUrl,
        emailValidationLink,
        nick: user.nick.toString(),
      },
    });

    await this.commandBus.execute(command);
  }
}

injected(
  SendEmailToCreatedUserHandler,
  TOKENS.config,
  TOKENS.commandBus,
  USER_TOKENS.repositories.userRepository
);

registerEventHandler(UserCreatedEvent, USER_TOKENS.eventHandlers.sendEmailToCreatedUserHandler);
