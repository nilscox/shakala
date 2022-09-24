import { Meta, Story } from '@storybook/react';
import { addComment, addThread, createComment, createThread, createUser } from 'frontend-domain';

import { reduxDecorator, routerDecorator, SetupRedux } from '~/utils/storybook';

import { ReportCommentModal } from './report-comment-modal';

export default {
  title: 'Domain/ReportCommentModal',
  decorators: [routerDecorator('?' + new URLSearchParams({ report: 'commentId' })), reduxDecorator()],
} as Meta;

// cspell:word gronaz

const comment = createComment({
  id: 'commentId',
  author: createUser({ nick: 'Gronaz' }),
  text: "Vous dites n'importe quoi ! Nous sachons ! Vous n'avez rien compris ! Je vous enquiquine tous !!!",
  downvotes: 51,
});

export const reportCommentModal: Story<{ setup: SetupRedux }> = () => <ReportCommentModal />;
reportCommentModal.args = {
  setup: (dispatch) => {
    dispatch(addThread(createThread({ comments: [comment] })));
    dispatch(addComment(comment));
  },
};
