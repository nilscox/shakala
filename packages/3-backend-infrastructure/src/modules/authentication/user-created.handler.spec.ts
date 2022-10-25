import { EmailKind, ExecutionContext, InMemoryUserRepository, SendEmailCommand } from 'backend-application';
import { factories, Nick, UserCreatedEvent } from 'backend-domain';

import { StubConfigAdapter } from '../../infrastructure';
import { MockCommandBus } from '../../test';

import { UserCreatedHandler } from './user-created.handler';

describe('UserCreatedHandler', () => {
  const userRepository = new InMemoryUserRepository();
  const commandBus = new MockCommandBus();

  const config = new StubConfigAdapter({
    app: {
      apiBaseUrl: 'https://api.url',
      appBaseUrl: 'https://app.url',
    },
  });

  const handler = new UserCreatedHandler(config, userRepository, commandBus);

  const create = factories();

  const user = create.user({
    email: 'user@domain.tld',
    nick: new Nick('nick'),
    emailValidationToken: 'token',
  });

  it('sends a welcome email to the user', async () => {
    userRepository.add(user);

    await handler.handle(new UserCreatedEvent(user.id));

    const emailValidationLink = `https://api.url/auth/signup/${user.id}/validate/${user.emailValidationToken}`;

    expect(commandBus.execute).toHaveBeenCalledWith(
      new SendEmailCommand(user.email, EmailKind.welcome, {
        appBaseUrl: 'https://app.url',
        nick: user.nick.toString(),
        emailValidationLink,
      }),
      ExecutionContext.unauthenticated,
    );
  });
});
