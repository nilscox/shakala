import { createComment, createThread, createUser } from 'backend-application';
import { CommentAuthor } from 'backend-domain';

const him = CommentAuthor.create(createUser({ nick: 'Him' }));
const myself = CommentAuthor.create(createUser({ nick: 'Myself' }));
const you = CommentAuthor.create(createUser({ nick: 'You' }));

const thread = createThread({
  id: 'flat',
  author: him,
  text: 'Is the earth flat?',
});

const comments = [
  createComment({
    threadId: thread.id,
    author: myself,
    text: 'yes',
    creationDate: '2022-02-08T11:43',
  }),
  createComment({
    threadId: thread.id,
    author: you,
    text: 'no',
    creationDate: '2022-02-08T11:43',
  }),
];

const replies = [
  createComment({
    threadId: thread.id,
    parentId: comments[0]?.id,
    author: you,
    text: 'I doubt that is true',
    creationDate: '2022-02-08T11:43',
  }),
];

export default {
  thread,
  comments: [...comments, ...replies],
};
