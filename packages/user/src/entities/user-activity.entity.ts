import { Entity, EntityProps, Timestamp } from '@shakala/common';
import { ReactionType } from '@shakala/shared';

export enum UserActivityType {
  signUp = 'signUp',
  signIn = 'signIn',
  signOut = 'signOut',
  emailAddressValidated = 'emailAddressValidated',
  // profileImageChanged = 'profileImageChanged',
  threadCreated = 'threadCreated',
  rootCommentCreated = 'rootCommentCreated',
  replyCreated = 'replyCreated',
  commentEdited = 'commentEdited',
  commentReactionSet = 'commentReactionSet',
  commentReported = 'commentReported',
}

type ThreadActivityPayload = {
  threadId: string;
  description: string;
  text: string;
};

type CommentActivityPayload = {
  threadId: string;
  threadDescription: string;
  commentId: string;
  commentText: string;
};

export type UserActivityPayload = {
  [UserActivityType.signUp]: undefined;
  [UserActivityType.signIn]: undefined;
  [UserActivityType.signOut]: undefined;
  [UserActivityType.emailAddressValidated]: undefined;

  [UserActivityType.threadCreated]: ThreadActivityPayload;

  [UserActivityType.rootCommentCreated]: CommentActivityPayload;
  [UserActivityType.replyCreated]: CommentActivityPayload & { parentId: string };
  [UserActivityType.commentEdited]: CommentActivityPayload;
  [UserActivityType.commentReactionSet]: CommentActivityPayload & { reaction: ReactionType | null };
  [UserActivityType.commentReported]: CommentActivityPayload & { reason?: string };
};

type UserActivityProps<Type extends UserActivityType = UserActivityType> = EntityProps<{
  type: Type;
  date: Timestamp;
  userId: string;
  payload: UserActivityPayload[Type];
}>;

export class UserActivity<Type extends UserActivityType = UserActivityType> extends Entity<
  UserActivityProps<Type>
> {
  get type() {
    return this.props.type;
  }

  get date() {
    return this.props.date;
  }

  get userId() {
    return this.props.userId;
  }

  get payload() {
    return this.props.payload;
  }
}
