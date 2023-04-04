import { createAuthorDto, createThreadDto } from '@shakala/shared';
import { action } from '@storybook/addon-actions';
import { Meta, StoryFn } from '@storybook/react';

import { configureStory, maxWidthDecorator } from '~/utils/storybook';
import { ValidationErrors } from '~/utils/validation-errors';

import { RootCommentForm } from './root-comment-form';

type Args = {
  validationError: boolean;
  unexpectedError: boolean;
};

export default {
  title: 'Domain/CommentForm',
  parameters: {
    pageContext: {
      pathname: '/discussions/threadId',
    },
  },
  decorators: [
    (Story) => (
      <div className="rounded border">
        <Story />
      </div>
    ),
    maxWidthDecorator,
  ],
  args: {
    validationError: false,
    unexpectedError: false,
  },
} satisfies Meta<Args>;

const thread = createThreadDto({ id: 'threadId', author: createAuthorDto({ nick: 'JJ Goldman' }) });

export const commentForm: StoryFn<Args> = ({}) => {
  return <RootCommentForm thread={thread} />;
};

commentForm.decorators = [
  configureStory((adapters, { unexpectedError, validationError }) => {
    if (unexpectedError) {
      adapters.comment.createComment.reject(new Error('Something went wrong'));
    } else if (validationError) {
      adapters.comment.createComment.reject(new ValidationErrors({ text: "This isn't very interesting" }));
    } else {
      adapters.comment.createComment.implement(async (...args) => {
        action('createComment')(args);
        return 'commentId';
      });
    }
  }),
];
