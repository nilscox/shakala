import { CreateUserActivityCommand, ExecutionContext } from '@shakala/backend-application';
import { factories, UserCreatedEvent } from '@shakala/backend-domain';

import { MockCommandBus } from '../../test';

import { CreateUserActivityHandler } from './create-user-activity.handler';

describe('CreateUserActivityHandler', () => {
  const commandBus = new MockCommandBus();
  const handler = new CreateUserActivityHandler(commandBus);

  const create = factories();

  const user = create.user();

  it('executes a CreateUserActivity command', async () => {
    const event = new UserCreatedEvent(user.id);

    await handler.handle(event);

    expect(commandBus.execute).toHaveBeenCalledWith(
      new CreateUserActivityCommand(event),
      ExecutionContext.unauthenticated,
    );
  });
});
