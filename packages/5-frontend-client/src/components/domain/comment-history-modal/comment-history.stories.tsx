import { Meta, Story } from '@storybook/react';
import { addComment, createComment, createThread, createUser, addThread } from 'frontend-domain';

import { reduxDecorator, routerDecorator, SetupRedux } from '~/utils/storybook';

import { CommentHistoryModal } from '../comment-history-modal/comment-history-modal';

export default {
  title: 'Domain/Comment',
  decorators: [routerDecorator('?' + new URLSearchParams({ historique: 'commentId' })), reduxDecorator()],
} as Meta;

// cspell:word bopzor
const bopzor = createUser({ nick: 'bopzor' });

const commentFixture = createComment({
  id: 'commentId',
  author: bopzor,
  text: 'after',
  edited: new Date('2022-08-14').toISOString(),
  history: [
    {
      date: new Date('2022-01-01').toISOString(),
      text: 'before 1',
    },
    {
      date: new Date('2022-04-02').toISOString(),
      text: 'before 2',
    },
    {
      date: new Date('2022-08-07').toISOString(),
      text: 'before 3',
    },
  ],
  upvotes: 61,
  downvotes: 25,
});

export const commentHistoryModal: Story<{ setup: SetupRedux }> = () => <CommentHistoryModal />;
commentHistoryModal.args = {
  setup: (dispatch) => {
    dispatch(addThread(createThread({ comments: [commentFixture] })));
    dispatch(addComment(commentFixture));
  },
};
