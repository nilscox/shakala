import {
  AuthenticationMethod,
  InstanceOf,
  ReactionTypeDto,
  UserActivityPayload,
  UserActivityType,
} from '@shakala/shared';

import { DomainEvent } from '../ddd/domain-event';
import { Comment } from '../entities/comment.entity';
import { Thread } from '../entities/thread.entity';
import { Timestamp } from '../entities/timestamp.value-object';
import { UserActivity } from '../entities/user-activity.entity';
import { UserAuthenticatedEvent } from '../events/authentication/user-authenticated.event';
import { UserCreatedEvent } from '../events/authentication/user-created.event';
import { UserSignedOutEvent } from '../events/authentication/user-signed-out.event';
import { CommentCreatedEvent } from '../events/comment/comment-created.event';
import { CommentEditedEvent } from '../events/comment/comment-edited.event';
import { CommentReactionSetEvent } from '../events/comment/comment-reaction-set.event';
import { CommentReportedEvent } from '../events/comment/comment-reported.event';
import { EmailAddressValidatedEvent } from '../events/profile/email-address-validated.event';
import { ProfileImageChangedEvent } from '../events/profile/profile-image-changed.event';
import { ThreadCreatedEvent } from '../events/thread/thread-created.event';
import { DatePort } from '../interfaces/date.interface';
import { GeneratorPort } from '../interfaces/generator.port';

type GetThread = (threadId: string) => Promise<Thread>;
type GetComment = (commentId: string) => Promise<Comment>;

const commentEvents = [
  CommentCreatedEvent,
  CommentEditedEvent,
  CommentReactionSetEvent,
  CommentReportedEvent,
] as const;

type CommentEvent = typeof commentEvents[number];

const isCommentEvent = (event: DomainEvent): event is InstanceOf<CommentEvent> => {
  return commentEvents.some((EventClass) => event instanceof EventClass);
};

export class UserActivityService {
  constructor(private readonly generator: GeneratorPort, private readonly dateAdapter: DatePort) {}

  private async createActivity<Type extends UserActivityType>(
    userId: string,
    type: Type,
    payload: UserActivityPayload[Type],
  ) {
    return UserActivity.create(type, {
      id: await this.generator.generateId(),
      date: Timestamp.now(this.dateAdapter),
      userId,
      payload,
    });
  }

  async mapEventToUserActivity(
    event: DomainEvent,
    { getThread, getComment }: { getThread: GetThread; getComment: GetComment },
  ): Promise<UserActivity | void> {
    if (event instanceof UserCreatedEvent) {
      return this.createActivity(event.userId, UserActivityType.signUp, undefined);
    }

    if (event instanceof UserAuthenticatedEvent) {
      return this.createActivity(event.userId, UserActivityType.signIn, {
        method: AuthenticationMethod.emailPassword,
      });
    }

    if (event instanceof UserSignedOutEvent) {
      return this.createActivity(event.userId, UserActivityType.signOut, undefined);
    }

    if (event instanceof EmailAddressValidatedEvent) {
      return this.createActivity(event.userId, UserActivityType.emailAddressValidated, undefined);
    }

    if (event instanceof ProfileImageChangedEvent) {
      return this.createActivity(event.userId, UserActivityType.profileImageChanged, { image: event.image });
    }

    if (event instanceof ThreadCreatedEvent) {
      const thread = await getThread(event.threadId);

      return this.createActivity(thread.author.id, UserActivityType.threadCreated, {
        threadId: thread.id,
        authorId: thread.author.id,
        description: thread.description,
        text: thread.text.toString(),
      });
    }

    if (!isCommentEvent(event)) {
      return;
    }

    const comment = await getComment(event.commentId);
    const thread = await getThread(comment.threadId);

    const payload = <T>(extra: T) => ({
      threadId: thread.id,
      threadDescription: thread.description,
      commentId: comment.id,
      commentText: comment.message.toString(),
      ...extra,
    });

    if (event instanceof CommentCreatedEvent) {
      if (comment.parentId) {
        const parent = await getComment(comment.parentId);

        return this.createActivity(
          comment.author.id,
          UserActivityType.replyCreated,
          payload({ parentId: parent.id }),
        );
      }

      return this.createActivity(comment.author.id, UserActivityType.rootCommentCreated, payload({}));
    }

    if (event instanceof CommentEditedEvent) {
      return this.createActivity(comment.author.id, UserActivityType.commentEdited, payload({}));
    }

    if (event instanceof CommentReactionSetEvent) {
      return this.createActivity(
        event.userId,
        UserActivityType.commentReactionSet,
        payload({
          userId: event.userId,
          // todo: replace ReactionTypeDto with ReactionType in shared
          reaction: event.reaction as unknown as ReactionTypeDto,
        }),
      );
    }

    if (event instanceof CommentReportedEvent) {
      return this.createActivity(
        event.userId,
        UserActivityType.commentReported,
        payload({
          reason: event.reason,
        }),
      );
    }
  }
}
