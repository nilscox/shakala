import {
  CommentProps,
  Comment,
  CommentAuthor,
  Markdown,
  Nick,
  ProfileImage,
  ThreadProps,
  Thread,
  ThreadAuthor,
  Timestamp,
  UserProps,
  User,
  Reaction,
  ReactionProps,
  ReactionType,
} from 'backend-domain';

import { ReactionsCount } from '../interfaces/reaction.repository';

type Replace<T, W> = Omit<T, keyof W> & W;

const randomId = () => Math.random().toString(36).slice(-6);

export const createTimestamp = (date?: string) => {
  return Timestamp.create(date ?? '2000-01-01T00:00:00.000Z');
};

type CreateUserProps = Replace<
  UserProps,
  {
    nick: string;
    profileImage: string;
    signupDate: string;
  }
>;

export const createUser = ({
  nick,
  profileImage,
  signupDate,
  ...props
}: Partial<CreateUserProps> = {}): User => {
  return User.create({
    id: randomId(),
    email: '',
    hashedPassword: '',
    nick: Nick.create(nick ?? 'nick'),
    profileImage: ProfileImage.create(profileImage),
    signupDate: createTimestamp(signupDate),
    lastLoginDate: null,
    ...props,
  });
};

type CreateCommentProps = Replace<
  CommentProps,
  {
    text: string;
    creationDate: string;
    lastEditionDate: string;
  }
>;

export const createComment = ({
  text,
  creationDate,
  lastEditionDate,
  ...props
}: Partial<CreateCommentProps> = {}): Comment => {
  return Comment.create({
    id: randomId(),
    threadId: '',
    author: CommentAuthor.create(createUser()),
    parentId: null,
    text: Markdown.create(text ?? ''),
    creationDate: createTimestamp(creationDate),
    lastEditionDate: createTimestamp(lastEditionDate ?? creationDate),
    ...props,
  });
};

type CreateReactionProps = ReactionProps;

export const createReaction = ({ ...props }: Partial<CreateReactionProps> = {}): Reaction => {
  return Reaction.create({
    id: randomId(),
    commentId: '',
    userId: '',
    type: ReactionType.upvote,
    ...props,
  });
};

type CreateReactionsCount = ReactionsCount;

export const createReactionsCount = ({ ...props }: Partial<CreateReactionsCount> = {}): ReactionsCount => {
  return {
    [ReactionType.upvote]: 0,
    [ReactionType.downvote]: 0,
    ...props,
  };
};

type CreateThreadProps = Replace<
  ThreadProps,
  {
    text: string;
    created: string;
  }
>;

export const createThread = ({ text, created, ...props }: Partial<CreateThreadProps> = {}): Thread => {
  return Thread.create({
    id: randomId(),
    author: ThreadAuthor.create(createUser()),
    text: Markdown.create(text ?? ''),
    created: createTimestamp(created),
    ...props,
  });
};
