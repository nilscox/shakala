import { createComment, createThread, createUser } from './factories';

const him = createUser({ nick: 'Him' });
const me = createUser({ nick: 'Me' });
const you = createUser({ nick: 'You' });

export const threadFlatEarth = createThread({
  id: 'fake',
  author: him,
  text: 'Is the earth flat?',
  comments: [
    createComment({
      author: me,
      text: 'yes',
      replies: [createComment({ author: you, text: 'I doubt that is true' })],
    }),
    createComment({
      author: you,
      text: 'no',
      replies: [],
    }),
  ],
});
