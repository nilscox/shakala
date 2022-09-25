import { Meta, Story } from '@storybook/react';
import { addComment, addThread, createComment, createThread, createUser } from 'frontend-domain';
import { createMemoryHistory } from 'history';

import { reduxDecorator, routerDecorator, SetupRedux } from '~/utils/storybook';

import { ReportCommentModal } from './report-comment-modal';

// cspell:word gronaz

const history = createMemoryHistory({
  initialEntries: ['?' + new URLSearchParams({ report: 'commentId' })],
});

export default {
  title: 'Domain/ReportCommentModal',
  decorators: [reduxDecorator(), routerDecorator(history)],
} as Meta;

const comment = createComment({
  id: 'commentId',
  author: createUser({ nick: 'Gronaz' }),
  text: "Vous dites n'importe quoi ! Nous sachons ! Vous n'avez rien compris ! Je vous enquiquine tous !!!",
  downvotes: 51,
});

export const reportCommentModal: Story<{ setup: SetupRedux }> = () => <ReportCommentModal />;
reportCommentModal.args = {
  setup: (dispatch, { routerGateway }) => {
    routerGateway.setQueryParam('report', 'commentId');
    dispatch(addThread(createThread({ comments: [comment] })));
    dispatch(addComment(comment));
  },
};
