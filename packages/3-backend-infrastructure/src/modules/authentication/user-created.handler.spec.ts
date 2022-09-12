import { EmailKind, InMemoryUserRepository, SendEmailCommand } from 'backend-application';
import { factories, Nick, UserCreatedEvent } from 'backend-domain';

import { TestConfigService } from '../../infrastructure';
import { MockCommandBus } from '../../test';

import { UserCreatedHandler } from './user-created.handler';

describe('UserCreatedHandler', () => {
  const userRepository = new InMemoryUserRepository();
  const commandBus = new MockCommandBus();
  const configService = new TestConfigService({ app: { apiBaseUrl: 'https://api.url' } });

  const handler = new UserCreatedHandler(configService, userRepository, commandBus);

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
        nick: user.nick.toString(),
        emailValidationLink,
      }),
    );
  });
});