import { factories, StubDateAdapter, StubGeneratorAdapter, Timestamp } from 'backend-domain';
import { NotificationType, UnexpectedError } from 'shared';

import {
  InMemoryCommentRepository,
  InMemoryCommentSubscriptionRepository,
  InMemoryNotificationRepository,
  InMemoryThreadRepository,
} from '../../../adapters';

import {
  CreateCommentReplyNotificationsCommand,
  CreateCommentReplyNotificationsHandler,
} from './create-comment-reply-notifications';

describe('CreateCommentReplyNotificationsCommand', () => {
  const generator = new StubGeneratorAdapter();
  const dateAdapter = new StubDateAdapter();
  const threadRepository = new InMemoryThreadRepository();
  const commentRepository = new InMemoryCommentRepository();
  const commentSubscriptionRepository = new InMemoryCommentSubscriptionRepository();
  const notificationRepository = new InMemoryNotificationRepository();

  const handler = new CreateCommentReplyNotificationsHandler(
    generator,
    dateAdapter,
    threadRepository,
    commentRepository,
    commentSubscriptionRepository,
    notificationRepository,
  );

  const create = factories();

  const thread = create.thread({
    id: 'threadId',
    description: 'thread description',
  });

  const parent = create.comment({
    id: 'parentId',
    threadId: 'threadId',
    author: create.user({ nick: create.nick('parent author') }),
  });

  const reply = create.comment({
    id: 'replyId',
    threadId: 'threadId',
    parentId: 'parentId',
    author: create.user({ nick: create.nick('reply author') }),
    message: create.message({ text: create.markdown('text') }),
  });

  const user = create.user({ id: 'userId' });
  const subscription = create.commentSubscription({ commentId: 'parentId', userId: user.id });

  const now = new Timestamp('2022-01-01');

  beforeEach(() => {
    generator.nextId = 'notificationId';
    dateAdapter.setNow(now);

    threadRepository.add(thread);
    commentRepository.add(parent);
    commentRepository.add(reply);
    commentSubscriptionRepository.add(subscription);
  });

  const execute = async (replyId = reply.id) => {
    const command = new CreateCommentReplyNotificationsCommand(replyId);

    return handler.handle(command);
  };

  it('creates notifications for all subscriptions when a reply is created', async () => {
    await execute();

    const notifications = notificationRepository.all();
    const [notification] = notifications;

    expect(notifications).toHaveLength(1);

    expect(notification).toHaveProperty('id', 'notificationId');
    expect(notification).toHaveProperty('userId', 'userId');
    expect(notification).toHaveProperty('date', now);
    expect(notification).toHaveProperty('type', NotificationType.replyCreated);

    expect(notification).toHaveProperty('payload', {
      threadId: 'threadId',
      threadDescription: 'thread description',
      parentId: 'parentId',
      parentAuthor: expect.objectWith({ nick: 'parent author' }),
      replyId: 'replyId',
      replyAuthor: expect.objectWith({ nick: 'reply author' }),
      text: 'text',
    });
  });

  it('does not send a notification to the author of the reply', async () => {
    const subscription = create.commentSubscription({ userId: reply.author.id, commentId: parent.id });

    commentSubscriptionRepository.add(subscription);

    await execute();

    expect(notificationRepository.all()).toHaveLength(1);
  });

  it('rejects when the comment id is not a reply', async () => {
    await expect.rejects(execute(parent.id)).with(UnexpectedError);
  });
});
