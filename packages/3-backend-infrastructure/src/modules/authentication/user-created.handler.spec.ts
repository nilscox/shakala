import { EmailKind, InMemoryUserRepository, SendEmailCommand } from 'backend-application';
import { factories, Nick, UserCreatedEvent } from 'backend-domain';

import { MockCommandBus } from '../../test';

import { UserCreatedHandler } from './user-created.handler';

describe('UserCreatedHandler', () => {
  const userRepository = new InMemoryUserRepository();
  const commandBus = new MockCommandBus();
  const handler = new UserCreatedHandler(userRepository, commandBus);

  const create = factories();

  const user = create.user({
    email: 'user@domain.tld',
    nick: new Nick('nick'),
    emailValidationToken: 'token',
  });

  it('sends a welcome email to the user', async () => {
    userRepository.add(user);

    await handler.handle(new UserCreatedEvent(user.id));

    expect(commandBus.execute).toHaveBeenCalledWith(
      new SendEmailCommand(user.email, EmailKind.welcome, {
        nick: user.nick.toString(),
        emailValidationLink: `/auth/signup/confirm/${user.emailValidationToken}`,
      }),
    );
  });
});
