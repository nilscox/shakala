import { factories, StubGeneratorAdapter } from 'backend-domain';
import { CommentAlreadySubscribedError, CommentNotSubscribedError } from 'shared';

import {
  InMemoryCommentRepository,
  InMemoryCommentSubscriptionRepository,
  InMemoryUserRepository,
  StubEventBus,
} from '../../../adapters';

import {
  SetCommentSubscriptionCommand,
  SetCommentSubscriptionCommandHandler,
} from './set-comment-subscription.command';

describe('SetCommentSubscriptionCommand', () => {
  const generator = new StubGeneratorAdapter();
  const eventBus = new StubEventBus();
  const userRepository = new InMemoryUserRepository();
  const commentRepository = new InMemoryCommentRepository();
  const commentSubscriptionRepository = new InMemoryCommentSubscriptionRepository();

  const handler = new SetCommentSubscriptionCommandHandler(
    generator,
    eventBus,
    userRepository,
    commentRepository,
    commentSubscriptionRepository,
  );

  const create = factories();
  const user = create.user();

  beforeEach(() => {
    generator.nextId = create.id();
    userRepository.add(user);
  });

  const execute = async (commentId: string, subscribed: boolean) => {
    return handler.handle(new SetCommentSubscriptionCommand(user.id, commentId, subscribed));
  };

  it('creates a new subscription to a root comment', async () => {
    const comment = create.comment();

    commentRepository.add(comment);

    await execute(comment.id, true);

    const subscriptions = await commentSubscriptionRepository.findByCommentId(comment.id);

    expect(subscriptions).toHaveLength(1);
    expect(subscriptions).toHaveProperty('0.userId', user.id);
    expect(subscriptions).toHaveProperty('0.commentId', comment.id);
  });

  it('creates a new subscription to a root comment by subscribing to one of its replies', async () => {
    const parent = create.comment({ id: 'parentId' });
    const reply = create.comment({ id: 'replyId', parentId: parent.id });

    commentRepository.add(parent);
    commentRepository.add(reply);

    await execute(reply.id, true);

    const subscriptions = await commentSubscriptionRepository.findByCommentId(parent.id);

    expect(subscriptions).toHaveLength(1);
    expect(subscriptions).toHaveProperty('0.userId', user.id);
    expect(subscriptions).toHaveProperty('0.commentId', parent.id);
  });

  it('throws a CommentAlreadySubscribedError when a subscription already exists', async () => {
    const comment = create.comment({ id: 'commentId' });
    const subscription = create.commentSubscription({ commentId: comment.id, userId: user.id });

    commentRepository.add(comment);
    commentSubscriptionRepository.add(subscription);

    await expect.rejects(execute(comment.id, true)).with(CommentAlreadySubscribedError);
  });

  it('throws a CommentAlreadySubscribedError when subscribing to a reply', async () => {
    const parent = create.comment({ id: 'parentId' });
    const reply = create.comment({ id: 'replyId', parentId: parent.id });
    const subscription = create.commentSubscription({ commentId: parent.id, userId: user.id });

    commentRepository.add(parent);
    commentRepository.add(reply);
    commentSubscriptionRepository.add(subscription);

    await expect.rejects(execute(reply.id, true)).with(CommentAlreadySubscribedError);
  });

  it('throws a error when the comment does not exist', async () => {
    await expect.rejects(execute('notExistingCommentId', true)).with(Error);
  });

  it('removes a new subscription to a root comment', async () => {
    const comment = create.comment();
    const subscription = create.commentSubscription({ commentId: comment.id, userId: user.id });

    commentRepository.add(comment);
    commentSubscriptionRepository.add(subscription);

    await execute(comment.id, false);

    expect(commentSubscriptionRepository.all()).toHaveLength(0);
  });

  it('throws a CommentNotSubscribedError when the subscription does not exist', async () => {
    const comment = create.comment({ id: 'commentId' });

    commentRepository.add(comment);

    await expect.rejects(execute(comment.id, false)).with(CommentNotSubscribedError);
  });
});
