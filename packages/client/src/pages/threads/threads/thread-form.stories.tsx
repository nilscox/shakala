import { action } from '@storybook/addon-actions';
import { Meta, StoryFn } from '@storybook/react';

import { ThreadFormFields } from '~/adapters/api/thread/thread.port';
import { configureStory, controls, maxWidthDecorator } from '~/utils/storybook';
import { ValidationErrors } from '~/utils/validation-errors';

import { ThreadForm } from './thread-form';

type Args = {
  validationError: boolean;
  unexpectedError: boolean;
};

export default {
  title: 'Domain/ThreadForm',
  decorators: [maxWidthDecorator],
  ...controls<Args>(({ boolean }) => ({
    validationError: boolean(false),
    unexpectedError: boolean(false),
  })),
} satisfies Meta<Args>;

export const threadForm: StoryFn<Args> = () => <ThreadForm />;

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
