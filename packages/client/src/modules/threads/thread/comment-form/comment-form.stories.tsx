import { action } from '@storybook/addon-actions';
import { Meta, StoryFn } from '@storybook/react';

import { maxWidthDecorator } from '~/utils/storybook';
import { ValidationErrors } from '~/utils/validation-errors';

import { CommentForm } from './comment-form';

type Args = {
  validationError: boolean;
  unexpectedError: boolean;
};

export default {
  title: 'Domain/CommentForm',
  parameters: {
    pageContext: {
      routeParams: { threadId: 'threadId' },
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

export const commentForm: StoryFn<Args> = ({ validationError, unexpectedError }) => (
  <CommentForm
    initialText=""
    onCancel={action('onCancel')}
    onSubmit={async (text) => {
      if (unexpectedError) {
        throw new Error('Something went wrong');
      }

      if (validationError) {
        throw new ValidationErrors({ text: "This isn't very interesting" });
      }

      action('onSubmit')(text);
      return '';
    }}
  />
);
