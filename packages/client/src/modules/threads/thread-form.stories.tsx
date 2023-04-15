import { action } from '@storybook/addon-actions';
import { Meta, StoryFn } from '@storybook/react';

import { ThreadFormFields } from '~/adapters/api/thread/thread.port';
import { configureStory, maxWidthDecorator } from '~/utils/storybook';
import { ValidationErrors } from '~/utils/validation-errors';

import { ThreadForm } from './thread-form';

type Args = {
  validationError: boolean;
  unexpectedError: boolean;
};

export default {
  title: 'Domain/ThreadForm',
  decorators: [maxWidthDecorator],
  args: {
    validationError: false,
    unexpectedError: false,
  },
} satisfies Meta<Args>;

// eslint-disable-next-line no-empty-pattern
export const threadForm: StoryFn<Args> = ({}) => (
  <ThreadForm
    onSubmit={async (fields) => {
      action('onSubmit')(fields);
      return 'threadId';
    }}
    submitButtonText="Créer"
  />
);

threadForm.decorators = [
  configureStory(({ thread }, { validationError, unexpectedError }) => {
    thread.createThread.implement(async (fields) => {
      if (unexpectedError) {
        throw new Error('Something went wrong');
      }

      if (validationError) {
        throw new ValidationErrors<ThreadFormFields>({ description: 'min', keywords: 'min', text: 'max' });
      }

      action('createThread')(fields);

      return 'threadId';
    });
  }),
];
