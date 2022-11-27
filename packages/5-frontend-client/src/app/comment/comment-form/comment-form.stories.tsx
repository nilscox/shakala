import { action } from '@storybook/addon-actions';
import { Meta } from '@storybook/react';

import { maxWidthDecorator } from '~/utils/storybook';

import { CommentForm } from './comment-form';

export default {
  title: 'Domain/CommentForm',
  decorators: [
    (Story) => (
      <div className="rounded border">
        <Story />
      </div>
    ),
    maxWidthDecorator(),
  ],
} as Meta;

export const commentForm = () => {
  return (
    <CommentForm
      canSubmit
      initialText=""
      onTextChange={action('onTextChange')}
      onCancel={action('onCancel')}
      onSubmit={async () => {
        action('onSubmit')();
        return true;
      }}
    />
  );
};
