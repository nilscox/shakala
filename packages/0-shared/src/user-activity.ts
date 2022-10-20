import { AuthenticationMethod, ReactionTypeDto } from './dtos';

export enum AuthenticationActivityType {
  signUp = 'signUp',
  signIn = 'signIn',
  signOut = 'signOut',
}

export enum ProfileActivityType {
  emailAddressValidated = 'emailAddressValidated',
  profileImageChanged = 'profileImageChanged',
}

export enum ThreadActivityType {
  threadCreated = 'threadCreated',
}

export enum CommentActivityType {
  rootCommentCreated = 'rootCommentCreated',
  replyCreated = 'replyCreated',
  commentEdited = 'commentEdited',
  commentReactionSet = 'commentReactionSet',
  commentReported = 'commentReported',
}

export const UserActivityType = {
  ...AuthenticationActivityType,
  ...ProfileActivityType,
  ...ThreadActivityType,
  ...CommentActivityType,
};

export type UserActivityType =
  | AuthenticationActivityType
  | ProfileActivityType
  | ThreadActivityType
  | CommentActivityType;

type CommentActivityPayload = {
  threadId: string;
  threadDescription: string;
  commentId: string;
  commentText: string;
};

export type UserActivityPayload = {
  [UserActivityType.signUp]: undefined;
  [UserActivityType.signIn]: { method: AuthenticationMethod };
  [UserActivityType.signOut]: undefined;

  [UserActivityType.emailAddressValidated]: undefined;
  [UserActivityType.profileImageChanged]: { image: string | null };

  [UserActivityType.threadCreated]: {
    threadId: string;
    authorId: string;
    description: string;
    text: string;
  };

  [UserActivityType.rootCommentCreated]: CommentActivityPayload;
  [UserActivityType.replyCreated]: CommentActivityPayload & { parentId: string };
  [UserActivityType.commentEdited]: CommentActivityPayload;
  [UserActivityType.commentReactionSet]: CommentActivityPayload & {
    userId: string;
    reaction: ReactionTypeDto | null;
  };
  [UserActivityType.commentReported]: CommentActivityPayload & { reason?: string };
};

export type UserActivityDto<Type extends UserActivityType> = {
  date: string;
  type: Type;
  payload: UserActivityPayload[Type];
};
