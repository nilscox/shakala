import { action } from '@storybook/addon-actions';
import { Meta } from '@storybook/react';
import { useState } from 'react';

import { maxWidthDecorator, routerDecorator } from '~/utils/storybook';

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
    routerDecorator(),
  ],
} as Meta;

export const commentForm = () => {
  const [message, setMessage] = useState('');

  return (
    <CommentForm
      message={message}
      setMessage={setMessage}
      canSubmit
      isSubmitting={false}
      onCancel={action('onCancel')}
      onSubmit={action('onSubmit')}
    />
  );
};
