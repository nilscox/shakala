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

export const createTimestamp = (date?: string | Date) => {
  return new Timestamp(date ?? new Date('2000-01-01'));
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
  return new User({
    id: randomId(),
    email: '',
    hashedPassword: '',
    nick: new Nick(nick ?? 'nick'),
    profileImage: new ProfileImage(profileImage),
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
  return new Comment({
    id: randomId(),
    threadId: '',
    author: CommentAuthor.create(createUser()),
    parentId: null,
    text: new Markdown(text ?? ''),
    creationDate: createTimestamp(creationDate),
    lastEditionDate: createTimestamp(lastEditionDate ?? creationDate),
    ...props,
  });
};

type CreateReactionProps = ReactionProps;

export const createReaction = ({ ...props }: Partial<CreateReactionProps> = {}): Reaction => {
  return new Reaction({
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
  return new Thread({
    id: randomId(),
    author: new ThreadAuthor(createUser()),
    text: new Markdown(text ?? ''),
    created: createTimestamp(created),
    ...props,
  });
};
