import { action } from '@storybook/addon-actions';
import { Meta } from '@storybook/react';

import { maxWidthDecorator } from '~/utils/storybook';

import { CommentForm } from './comment-form';

export default {
  title: 'Domain/CommentForm',
  parameters: {
    pageContext: {
      routeParams: { threadId: 'threadId' },
    },
  },
  decorators: [
    maxWidthDecorator,
    (Story) => (
      <div className="rounded border">
        <Story />
      </div>
    ),
  ],
} as Meta;

export const commentForm = () => (
  <CommentForm
    initialText=""
    onCancel={action('onCancel')}
    onSubmit={async () => {
      action('onSubmit')();
      return '';
    }}
  />
);
