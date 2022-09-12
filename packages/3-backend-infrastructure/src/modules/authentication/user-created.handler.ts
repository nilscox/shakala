import { EmailKind, EventHandler, SendEmailCommand, UserRepository } from 'backend-application';
import { UserCreatedEvent } from 'backend-domain';

import { CommandBus } from '../../infrastructure';

export class UserCreatedHandler implements EventHandler<UserCreatedEvent> {
  constructor(private readonly userRepository: UserRepository, private readonly commandBus: CommandBus) {}

  async handle(event: UserCreatedEvent): Promise<void> {
    const user = await this.userRepository.findByIdOrFail(event.userId);

    await this.commandBus.execute(
      new SendEmailCommand(user.email, EmailKind.welcome, {
        nick: user.nick.toString(),
        emailValidationLink: `/auth/signup/confirm/${user.emailValidationToken}`,
      }),
    );
  }
}
