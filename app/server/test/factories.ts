import { createDate } from '~/factories';

import { CommentProps, CommentEntity } from '../data/comment/comment.entity';
import { ThreadEntity, ThreadProps } from '../data/thread/thread.entity';
import { UserEntity, UserProps } from '../data/user/user.entity';

const randomId = () => Math.random().toString(36).slice(-6);

export const createUserEntity = (props?: Partial<UserProps>): UserEntity => {
  return new UserEntity({
    id: randomId(),
    email: '',
    hashedPassword: '',
    nick: '',
    profileImage: null,
    signupDate: createDate(),
    lastLoginDate: null,
    ...props,
  });
};

export const createCommentEntity = (props?: Partial<CommentProps>): CommentEntity => {
  return new CommentEntity({
    id: randomId(),
    threadId: '',
    authorId: '',
    parentId: null,
    text: '',
    upvotes: 0,
    downvotes: 0,
    createdAt: createDate(),
    updatedAt: createDate(),
    ...props,
  });
};

export const createThreadEntity = (props?: Partial<ThreadProps>): ThreadEntity => {
  return new ThreadEntity({
    id: randomId(),
    authorId: '',
    text: '',
    createdAt: createDate(),
    updatedAt: createDate(),
    ...props,
  });
};
