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
  const now = new Date('2022-01-01');

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
    activityType: Type;
    payload: UserActivityPayload[Type];
  }) => obj;

  const tests = [
    test({
      event: new UserCreatedEvent('userId'),
      activityType: UserActivityType.signUp,
      payload: undefined,
    }),

    test({
      event: new UserAuthenticatedEvent('userId', AuthenticationMethod.emailPassword),
      activityType: UserActivityType.signIn,
      payload: { method: AuthenticationMethod.emailPassword },
    }),

    test({
      event: new UserSignedOutEvent('userId'),
      activityType: UserActivityType.signOut,
      payload: undefined,
    }),

    test({
      event: new EmailAddressValidatedEvent('userId'),
      activityType: UserActivityType.emailAddressValidated,
      payload: undefined,
    }),

    test({
      event: new ProfileImageChangedEvent('userId', 'image'),
      activityType: UserActivityType.profileImageChanged,
      payload: { image: 'image' },
    }),

    test({
      event: new ThreadCreatedEvent(thread.id),
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
      activityType: UserActivityType.rootCommentCreated,
      payload: commentActivityPayload,
    }),

    test({
      event: new CommentCreatedEvent(reply.id),
      activityType: UserActivityType.replyCreated,
      payload: { ...replyActivityPayload, parentId: comment.id },
    }),

    test({
      event: new CommentEditedEvent(comment.id),
      activityType: UserActivityType.commentEdited,
      payload: commentActivityPayload,
    }),

    test({
      event: new CommentReactionSetEvent(comment.id, user.id, ReactionType.upvote),
      activityType: UserActivityType.commentReactionSet,
      payload: { ...commentActivityPayload, userId: user.id, reaction: ReactionTypeDto.upvote },
    }),

    test({
      event: new CommentReportedEvent(comment.id, user.id, 'reason'),
      activityType: UserActivityType.commentReactionReported,
      payload: { ...commentActivityPayload, reason: 'reason' },
    }),
  ];

  const execute = (event: DomainEvent) => {
    return service.mapEventToUserActivity(user, event, {
      getThread: () => Promise.resolve(thread),
      getComment: (id) => Promise.resolve(id === comment.id ? comment : reply),
    });
  };

  for (const { event, activityType, payload } of tests) {
    it(`creates a ${activityType} activity`, async () => {
      expect(await execute(event)).toEqual(
        new UserActivity({ id: activityId, userId: user.id, date: now, type: activityType, payload }),
      );
    });
  }
});
