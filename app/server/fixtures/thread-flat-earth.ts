import { createDate } from '~/factories';
import { createCommentEntity, createThreadEntity, createUserEntity } from '~/server/test/factories';

const him = createUserEntity({ nick: 'Him' });
const me = createUserEntity({ nick: 'Me' });
const you = createUserEntity({ nick: 'You' });

const thread = createThreadEntity({
  id: 'flat',
  authorId: him.id,
  text: 'Is the earth flat?',
});

const comments = [
  createCommentEntity({
    threadId: thread.id,
    authorId: me.id,
    text: 'yes',
    createdAt: createDate('2022-02-08T11:43'),
  }),
  createCommentEntity({
    threadId: thread.id,
    authorId: you.id,
    text: 'no',
    createdAt: createDate('2022-02-08T11:43'),
  }),
];

const replies = [
  createCommentEntity({
    threadId: thread.id,
    parentId: comments[0].id,
    authorId: you.id,
    text: 'I doubt that is true',
    createdAt: createDate('2022-02-08T11:43'),
  }),
];

export default {
  thread,
  comments: [...comments, ...replies],
  users: [him, me, you],
};
