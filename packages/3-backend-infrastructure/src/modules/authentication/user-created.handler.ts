import {
  EmailKind,
  EventHandler,
  ExecutionContext,
  SendEmailCommand,
  UserRepository,
} from '@shakala/backend-application';
import { UserCreatedEvent } from '@shakala/backend-domain';

import { CommandBus, ConfigPort } from '../../infrastructure';

export class UserCreatedHandler implements EventHandler<UserCreatedEvent> {
  constructor(
    private readonly config: ConfigPort,
    private readonly userRepository: UserRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async handle(event: UserCreatedEvent): Promise<void> {
    const user = await this.userRepository.findByIdOrFail(event.userId);
    const { apiBaseUrl, appBaseUrl } = this.config.app();

    await this.commandBus.execute(
      new SendEmailCommand(user.email, EmailKind.welcome, {
        appBaseUrl,
        nick: user.nick.toString(),
        emailValidationLink: `${apiBaseUrl}/auth/signup/${user.id}/validate/${user.emailValidationToken}`,
      }),
      ExecutionContext.unauthenticated,
    );
  }
}
