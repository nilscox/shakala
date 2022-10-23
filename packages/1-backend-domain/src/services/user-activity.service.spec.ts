import { AuthenticationMethod, ReactionTypeDto, UserActivityPayload, UserActivityType } from 'shared';

import {
  CommentCreatedEvent,
  CommentEditedEvent,
  CommentReactionSetEvent,
  CommentReportedEvent,
  DomainEvent,
  EmailAddressValidatedEvent,
  factories,
  ProfileImageChangedEvent,
  ReactionType,
  StubDateAdapter,
  StubGeneratorAdapter,
  ThreadCreatedEvent,
  Timestamp,
  UserActivity,
  UserActivityService,
  UserAuthenticatedEvent,
  UserCreatedEvent,
  UserSignedOutEvent,
} from 'backend-domain';

describe('UserActivityService', () => {
  const generator = new StubGeneratorAdapter();
  const dateAdapter = new StubDateAdapter();

  const service = new UserActivityService(generator, dateAdapter);

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

  const reply = create.comment({
    author,
    threadId: thread.id,
    parentId: comment.id,
    message: create.message({ text: create.markdown('text') }),
  });

  beforeEach(() => {
    generator.nextId = activityId;
    dateAdapter.setNow(now);
  });

  const commentActivityPayload = {
    threadId: thread.id,
    threadDescription: 'description',
    commentId: comment.id,
    commentText: 'text',
  };

  const replyActivityPayload = {
    threadId: thread.id,
    threadDescription: 'description',
    commentId: reply.id,
    commentText: 'text',
  };

  const test = <Type extends UserActivityType>(obj: {
    event: DomainEvent;
    userId: string;
    activityType: Type;
    payload: UserActivityPayload[Type];
  }) => obj;

  const tests = [
    test({
      event: new UserCreatedEvent(user.id),
      userId: user.id,
      activityType: UserActivityType.signUp,
      payload: undefined,
    }),

    test({
      event: new UserAuthenticatedEvent(user.id, AuthenticationMethod.emailPassword),
      userId: user.id,
      activityType: UserActivityType.signIn,
      payload: { method: AuthenticationMethod.emailPassword },
    }),

    test({
      event: new UserSignedOutEvent(user.id),
      userId: user.id,
      activityType: UserActivityType.signOut,
      payload: undefined,
    }),

    test({
      event: new EmailAddressValidatedEvent(user.id),
      userId: user.id,
      activityType: UserActivityType.emailAddressValidated,
      payload: undefined,
    }),

    test({
      event: new ProfileImageChangedEvent(user.id, 'image'),
      userId: user.id,
      activityType: UserActivityType.profileImageChanged,
      payload: { image: 'image' },
    }),

    test({
      event: new ThreadCreatedEvent(thread.id),
      userId: author.id,
      activityType: UserActivityType.threadCreated,
      payload: {
        threadId: thread.id,
        authorId: author.id,
        description: thread.description,
        text: thread.text.toString(),
      },
    }),

    test({
      event: new CommentCreatedEvent(comment.id),
      userId: author.id,
      activityType: UserActivityType.rootCommentCreated,
      payload: commentActivityPayload,
    }),

    test({
      event: new CommentCreatedEvent(reply.id),
      userId: author.id,
      activityType: UserActivityType.replyCreated,
      payload: { ...replyActivityPayload, parentId: comment.id },
    }),

    test({
      event: new CommentEditedEvent(comment.id),
      userId: author.id,
      activityType: UserActivityType.commentEdited,
      payload: commentActivityPayload,
    }),

    test({
      event: new CommentReactionSetEvent(comment.id, user.id, ReactionType.upvote),
      userId: user.id,
      activityType: UserActivityType.commentReactionSet,
      payload: { ...commentActivityPayload, userId: user.id, reaction: ReactionTypeDto.upvote },
    }),

    test({
      event: new CommentReportedEvent(comment.id, user.id, 'reason'),
      userId: user.id,
      activityType: UserActivityType.commentReported,
      payload: { ...commentActivityPayload, reason: 'reason' },
    }),
  ];

  const execute = (event: DomainEvent) => {
    return service.mapEventToUserActivity(event, {
      getThread: () => Promise.resolve(thread),
      getComment: (id) => Promise.resolve(id === comment.id ? comment : reply),
    });
  };

  for (const { event, userId, activityType, payload } of tests) {
    it(`creates a ${activityType} activity`, async () => {
      expect(await execute(event)).toEqual(
        new UserActivity({ id: activityId, userId, date: now, type: activityType, payload }),
      );
    });
  }
});
