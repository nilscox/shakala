import { EmailKind, SendEmailCommand } from 'backend-application';
import { UserCreatedEvent } from 'backend-domain';

import { MockCommandBus } from '../../test';

import { UserCreatedHandler } from './user-created.handler';

describe('UserCreatedHandler', () => {
  const commandBus = new MockCommandBus();
  const handler = new UserCreatedHandler(commandBus);

  it('sends a welcome email to the user', async () => {
    await handler.handle(new UserCreatedEvent('userId'));

    expect(commandBus.execute).toHaveBeenCalledWith(
      new SendEmailCommand(EmailKind.welcome, { userId: 'userId' }),
    );
  });
});
