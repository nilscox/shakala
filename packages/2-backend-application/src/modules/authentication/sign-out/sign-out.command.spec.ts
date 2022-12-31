import { factories, UserSignedOutEvent } from '@shakala/backend-domain';

import { StubEventBus } from '../../../adapters';
import { ExecutionContext } from '../../../utils';

import { SignOutCommand, SignOutCommandHandler } from './sign-out.command';

describe('SignOutCommand', () => {
  const eventBus = new StubEventBus();
  const handler = new SignOutCommandHandler(eventBus);

  const create = factories();
  const user = create.user();

  const signOut = async () => {
    return handler.handle(new SignOutCommand(), ExecutionContext.as(user));
  };

  it('emits a UserSignedOutEvent', async () => {
    await signOut();

    expect(eventBus.lastEvent).toEqual(new UserSignedOutEvent(user.id));
  });
});
