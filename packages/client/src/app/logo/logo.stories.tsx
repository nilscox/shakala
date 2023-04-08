import { Meta, StoryFn } from '@storybook/react';
import { clsx } from 'clsx';

import { controls } from '~/utils/storybook';

import { Logo } from './logo';

type Args = {
  debug: boolean;
  border: boolean;
  color: string;
  size: number;
};

export default {
  title: 'Domain/Logo',
  args: {
    debug: false,
    border: false,
    color: '#000000',
    size: 8,
  },
  argTypes: {
    size: controls.range({ min: 1, max: 100 }),
  },
} satisfies Meta<Args>;

export const logo: StoryFn<Args> = ({ border, color, size, ...args }) => (
  <Logo
    width={size * 24}
    height={size * 16}
    className={clsx(border && 'border')}
    style={{ color }}
    {...args}
  />
);
