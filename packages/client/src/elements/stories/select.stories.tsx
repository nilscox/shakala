import { Meta, StoryFn } from '@storybook/react';

import { maxWidthDecorator } from '~/utils/storybook';

import { Select } from '../select';

export default {
  title: 'Elements/Select',
  decorators: [maxWidthDecorator],
} satisfies Meta;

export const select: StoryFn = () => (
  <Select>
    <option>New York</option>
    <option>Paris</option>
    <option>Tokyo</option>
  </Select>
);
