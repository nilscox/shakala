import {
  EmailKind,
  EventHandler,
  ExecutionContext,
  SendEmailCommand,
  UserRepository,
} from 'backend-application';
import { UserCreatedEvent } from 'backend-domain';

import { CommandBus, ConfigPort } from '../../infrastructure';

export class UserCreatedHandler implements EventHandler<UserCreatedEvent> {
  constructor(
    private readonly config: ConfigPort,
    private readonly userRepository: UserRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async handle(event: UserCreatedEvent): Promise<void> {
    const user = await this.userRepository.findByIdOrFail(event.userId);
    const { apiBaseUrl } = this.config.app();

    await this.commandBus.execute(
      new SendEmailCommand(user.email, EmailKind.welcome, {
        nick: user.nick.toString(),
        emailValidationLink: `${apiBaseUrl}/auth/signup/${user.id}/validate/${user.emailValidationToken}`,
      }),
      ExecutionContext.unauthenticated,
    );
  }
}
