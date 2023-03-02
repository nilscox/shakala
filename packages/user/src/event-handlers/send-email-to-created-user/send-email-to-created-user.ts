import assert from 'assert';

import { CommandBus, ConfigPort, EventHandler, TOKENS } from '@shakala/common';
import { EmailKind, sendEmail } from '@shakala/email';
import { injected } from 'brandi';

import { UserCreatedEvent } from '../../commands/create-user/create-user';
import { UserRepository } from '../../repositories/user.repository';
import { USER_TOKENS } from '../../tokens';

export class SendEmailToCreatedUserHandler implements EventHandler<UserCreatedEvent> {
  constructor(
    private readonly config: ConfigPort,
    private readonly userRepository: UserRepository,
    private readonly commandBus: CommandBus
  ) {}

  async handle(event: UserCreatedEvent): Promise<void> {
    const user = await this.userRepository.findByIdOrFail(event.id);

    assert(user.emailValidationToken, 'user has no email validation token');

    const { apiBaseUrl, appBaseUrl } = this.config.app;
    const emailValidationLink = `${apiBaseUrl}/user/validate-email/${user.emailValidationToken}`;

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

injected(SendEmailToCreatedUserHandler, TOKENS.config, USER_TOKENS.userRepository, TOKENS.commandBus);