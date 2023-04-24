import { Meta, StoryFn } from '@storybook/react';

import { Spinner } from '../spinner';

export default {
  title: 'Elements/Spinner',
} satisfies Meta;

export const spinner: StoryFn = () => <Spinner />;
