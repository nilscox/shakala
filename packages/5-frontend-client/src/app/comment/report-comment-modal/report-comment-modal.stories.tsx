import { Meta } from '@storybook/react';
import { commentActions, createComment, createUser, routerActions } from '@shakala/frontend-domain';
import { CommentAlreadyReportedError } from '@shakala/shared';

import { controls, reduxDecorator, ReduxStory } from '~/utils/storybook';

import { ReportCommentModal } from './report-comment-modal';

// cspell:word gronaz

type Args = {
  alreadyReported: boolean;
};

export default {
  title: 'Domain/ReportCommentModal',
  decorators: [reduxDecorator()],
  argTypes: {
    alreadyReported: controls.boolean(false),
  },
} as Meta<Args>;

const comment = createComment({
  id: 'commentId',
  author: createUser({ nick: 'Gronaz' }),
  text: "Vous dites n'importe quoi ! Nous sachons ! Vous n'avez rien compris ! Je vous enquiquine tous !!!",
  downvotes: 51,
});

export const reportCommentModal: ReduxStory<Args> = () => <ReportCommentModal />;
reportCommentModal.args = {
  setup: (dispatch, getState, { args, commentGateway }) => {
    dispatch(routerActions.setQueryParam(['report', 'commentId']));
    dispatch(commentActions.addComment(comment));

    commentGateway.reportComment.resolve(undefined, 1000);

    if (args.alreadyReported) {
      commentGateway.reportComment.reject(new CommentAlreadyReportedError(comment.id), 1000);
    }
  },
};
