import { factories, StubGeneratorAdapter } from 'backend-domain';

import { InMemoryCommentSubscriptionRepository, StubEventBus } from '../../../adapters';

import {
  CreateCommentSubscriptionCommand,
  CreateCommentSubscriptionCommandHandler,
} from './create-comment-subscription.command';

describe('CreateCommentSubscriptionCommand', () => {
  const generator = new StubGeneratorAdapter();
  const eventBus = new StubEventBus();
  const commentSubscriptionRepository = new InMemoryCommentSubscriptionRepository();

  const handler = new CreateCommentSubscriptionCommandHandler(
    generator,
    eventBus,
    commentSubscriptionRepository,
  );

  const create = factories();

  beforeEach(() => {
    generator.nextId = create.id();
  });

  const execute = async () => {
    return handler.handle(new CreateCommentSubscriptionCommand('userId', 'commentId'));
  };

  it('creates a new subscription to a comment', async () => {
    await execute();

    const subscriptions = await commentSubscriptionRepository.findByCommentId('commentId');

    expect(subscriptions).toHaveLength(1);
    expect(subscriptions).toHaveProperty('0.userId', 'userId');
  });
});
