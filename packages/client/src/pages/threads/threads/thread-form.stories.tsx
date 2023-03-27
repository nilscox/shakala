import { Meta, StoryFn } from '@storybook/react';

import { configureStory, maxWidthDecorator } from '~/utils/storybook';

import { ThreadForm } from './thread-form';

export default {
  title: 'Domain/ThreadForm',
  decorators: [maxWidthDecorator],
} satisfies Meta;

export const threadForm: StoryFn = () => <ThreadForm />;

threadForm.decorators = [
  configureStory(({ thread }) => {
    thread.createThread.delay = 1000;
    thread.createThread.resolve('threadId');
  }),
];
