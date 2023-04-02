import { ReactionType } from '../schemas/comment';
import { createFactory } from '../utils/create-factory';
import { randomId } from '../utils/random-id';

export type UserDto = {
  id: string;
  nick: string;
  email: string;
  profileImage?: string;
};

export const createUserDto = createFactory<UserDto>(() => ({
  id: '',
  nick: '',
  email: '',
}));

export type UserActivityDto<Type extends UserActivityType = UserActivityType> = {
  id: string;
  type: Type;
  date: string;
  payload: UserActivityPayload[Type];
};

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

export const createUserActivityDto = <Type extends UserActivityType>(
  overrides?: Partial<UserActivityDto<Type>>
): UserActivityDto<Type> => ({
  id: randomId(),
  date: '',
  type: '' as never,
  payload: {} as never,
  ...overrides,
});
