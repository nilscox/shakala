import { factories, StubGeneratorAdapter } from 'backend-domain';

import {
  InMemoryCommentRepository,
  InMemoryCommentSubscriptionRepository,
  StubEventBus,
} from '../../../adapters';

import {
  SetCommentSubscriptionCommand,
  SetCommentSubscriptionCommandHandler,
} from './set-comment-subscription.command';

describe('SetCommentSubscriptionCommand', () => {
  const generator = new StubGeneratorAdapter();
  const eventBus = new StubEventBus();
  const commentRepository = new InMemoryCommentRepository();
  const commentSubscriptionRepository = new InMemoryCommentSubscriptionRepository();

  const handler = new SetCommentSubscriptionCommandHandler(
    generator,
    eventBus,
    commentRepository,
    commentSubscriptionRepository,
  );

  const create = factories();

  beforeEach(() => {
    generator.nextId = create.id();
  });

  const execute = async (commentId: string) => {
    return handler.handle(new SetCommentSubscriptionCommand('userId', commentId));
  };

  it('creates a new subscription to a root comment', async () => {
    const comment = create.comment();

    commentRepository.add(comment);

    await execute(comment.id);

    const subscriptions = await commentSubscriptionRepository.findByCommentId(comment.id);

    expect(subscriptions).toHaveLength(1);
    expect(subscriptions).toHaveProperty('0.userId', 'userId');
    expect(subscriptions).toHaveProperty('0.commentId', comment.id);
  });

  it('creates a new subscription to a root comment by subscribing to one of its replies', async () => {
    const parent = create.comment({ id: 'parentId' });
    const reply = create.comment({ id: 'replyId', parentId: parent.id });

    commentRepository.add(parent);
    commentRepository.add(reply);

    await execute(reply.id);

    const subscriptions = await commentSubscriptionRepository.findByCommentId(parent.id);

    expect(subscriptions).toHaveLength(1);
    expect(subscriptions).toHaveProperty('0.userId', 'userId');
    expect(subscriptions).toHaveProperty('0.commentId', parent.id);
  });
});
