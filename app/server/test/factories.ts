import { Nick } from '../common/nick.value-object';
import { ProfileImage } from '../common/profile-image.value-object';
import { Timestamp } from '../common/timestamp.value-object';
import { Comment, CommentAuthor, CommentProps } from '../thread/comment.entity';
import { Markdown } from '../thread/markdown.value-object';
import { Thread, ThreadAuthor, ThreadProps } from '../thread/thread.entity';
import { User, UserProps } from '../user/user.entity';

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

export const createCommentEntity = ({
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
    upvotes: 0,
    downvotes: 0,
    creationDate: createTimestamp(creationDate),
    lastEditionDate: createTimestamp(lastEditionDate),
    ...props,
  });
};

type CreateThreadProps = Replace<
  ThreadProps,
  {
    text: string;
    created: string;
  }
>;

export const createThreadEntity = ({ text, created, ...props }: Partial<CreateThreadProps> = {}): Thread => {
  return Thread.create({
    id: randomId(),
    author: ThreadAuthor.create(createUser()),
    text: Markdown.create(text ?? ''),
    created: createTimestamp(created),
    ...props,
  });
};
