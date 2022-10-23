import {
  CommentReportedEvent,
  factories,
  StubDateAdapter,
  StubGeneratorAdapter,
  Timestamp,
  UserActivity,
  UserActivityService,
} from 'backend-domain';
import { UserActivityType } from 'shared';

import { InMemoryCommentRepository, InMemoryThreadRepository } from '../../../adapters';
import { InMemoryUserActivityRepository } from '../../../adapters/in-memory-repositories/user-activity.in-memory-repository';

import { CreateUserActivityCommand, CreateUserActivityHandler } from './create-user-activity.command';

describe('CreateUserActivityCommand', () => {
  const generator = new StubGeneratorAdapter();
  const dateAdapter = new StubDateAdapter();
  const userActivityRepository = new InMemoryUserActivityRepository();
  const threadRepository = new InMemoryThreadRepository();
  const commentRepository = new InMemoryCommentRepository();

  const handler = new CreateUserActivityHandler(
    userActivityRepository,
    threadRepository,
    commentRepository,
    new UserActivityService(generator, dateAdapter),
  );

  const activityId = 'activityId';
  const now = new Timestamp('2022-01-01');

  const create = factories();

  const author = create.author();
  const user = create.user();

  const thread = create.thread({ author, description: 'description' });

  const comment = create.comment({
    author,
    threadId: thread.id,
    message: create.message({ text: create.markdown('text') }),
  });

  beforeEach(() => {
    generator.nextId = activityId;
    dateAdapter.setNow(now);

    threadRepository.add(thread);
    commentRepository.add(comment);
  });

  it('creates a user activity from a domain event', async () => {
    const event = new CommentReportedEvent(comment.id, user.id, 'reason');

    await handler.handle(new CreateUserActivityCommand(event));

    expect(userActivityRepository.get(activityId)).toEqual(
      new UserActivity({
        id: activityId,
        type: UserActivityType.commentReported,
        userId: user.id,
        date: now,
        payload: {
          threadId: thread.id,
          threadDescription: 'description',
          commentId: comment.id,
          commentText: 'text',
          reason: 'reason',
        },
      }),
    );
  });
});
