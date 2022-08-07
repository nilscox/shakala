import {
  CommentProps,
  Comment,
  Markdown,
  Nick,
  ProfileImage,
  ThreadProps,
  Thread,
  Timestamp,
  UserProps,
  User,
  Reaction,
  ReactionProps,
  ReactionType,
  Author,
  Message,
  MessageProps,
  GeneratorService,
} from 'backend-domain';
import { createFactory, randomId, Replace } from 'shared';

import { ReactionsCount } from '../interfaces/reaction.repository';
import { StubGeneratorService } from '../test/generator.stub';

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

type CreateMessageProps = Partial<MessageProps>;

export const createMessage = (props: CreateMessageProps = {}) => {
  return new Message({
    id: randomId(),
    author: new Author(createUser()),
    text: new Markdown(''),
    date: createTimestamp(),
    ...props,
  });
};

type CreateCommentProps = Partial<CommentProps>;

export const createComment = (
  { author: author_, ...props }: CreateCommentProps = {},
  generatorService: GeneratorService = new StubGeneratorService(),
): Comment => {
  const author = author_ ?? new Author(createUser());

  return new Comment(
    {
      id: randomId(),
      threadId: '',
      author,
      parentId: null,
      message: createMessage({
        author,
      }),
      history: [],
      ...props,
    },
    generatorService,
  );
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

export const createReactionsCount = createFactory<ReactionsCount>(() => ({
  [ReactionType.upvote]: 0,
  [ReactionType.downvote]: 0,
}));

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
    author: new Author(createUser()),
    description: '',
    text: new Markdown(text ?? ''),
    keywords: [],
    created: createTimestamp(created),
    ...props,
  });
};
