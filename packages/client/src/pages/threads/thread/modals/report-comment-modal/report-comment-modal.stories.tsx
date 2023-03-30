import { createAuthorDto, createCommentDto } from '@shakala/shared';
import { action } from '@storybook/addon-actions';
import { Meta, StoryFn } from '@storybook/react';

import { configureStory } from '~/utils/storybook';

import { ReportCommentModal } from './report-comment-modal';

// cspell:word gronaz

export default {
  title: 'Domain/ReportCommentModal',
  parameters: {
    pageContext: {
      urlParsed: {
        searchOriginal: new URLSearchParams({ signaler: 'commentId' }).toString(),
      },
    },
  },
} satisfies Meta;

const comment = createCommentDto({
  id: 'commentId',
  author: createAuthorDto({ nick: 'Gronaz' }),
  text: "Vous dites n'importe quoi ! Nous sachons ! Vous n'avez rien compris ! Je vous enquiquine tous !!!",
  downvotes: 51,
});

export const reportCommentModal: StoryFn = () => <ReportCommentModal />;

reportCommentModal.decorators = [
  configureStory((adapters) => {
    adapters.comment.getComment.resolve(comment);

    adapters.comment.reportComment.implement(async (commentId, reason) => {
      action('reportComment')(commentId, reason);
    });
  }),
];
