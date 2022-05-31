import { createCommentEntity, createThreadEntity, createUser } from '~/server/test/factories';

import { CommentAuthor } from '../thread/comment.entity';

const him = CommentAuthor.create(createUser({ nick: 'Him' }));
const myself = CommentAuthor.create(createUser({ nick: 'Myself' }));
const you = CommentAuthor.create(createUser({ nick: 'You' }));

const thread = createThreadEntity({
  id: 'flat',
  author: him,
  text: 'Is the earth flat?',
});

const comments = [
  createCommentEntity({
    threadId: thread.id,
    author: myself,
    text: 'yes',
    creationDate: '2022-02-08T11:43',
  }),
  createCommentEntity({
    threadId: thread.id,
    author: you,
    text: 'no',
    creationDate: '2022-02-08T11:43',
  }),
];

const replies = [
  createCommentEntity({
    threadId: thread.id,
    parentId: comments[0].id,
    author: you,
    text: 'I doubt that is true',
    creationDate: '2022-02-08T11:43',
  }),
];

export default {
  thread,
  comments: [...comments, ...replies],
};
