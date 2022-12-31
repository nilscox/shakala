import { Meta, StoryFn } from '@storybook/react';
import { clsx } from 'clsx';

import { controls } from '~/utils/storybook';

import { Logo } from './logo';

export default {
  title: 'Domain/Logo',
  argTypes: {
    debug: controls.boolean(false),
    border: controls.boolean(false),
    color: controls.text('#000000'),
    size: controls.range(8, { min: 1, max: 100 }),
    className: controls.disabled(),
  },
} as Meta;

type Args = {
  debug: boolean;
  border: boolean;
  color: string;
  size: number;
  className?: string;
};

export const logo: StoryFn<Args> = ({ border, color, size, ...args }) => (
  <Logo
    width={size * 48}
    height={size * 32}
    className={clsx(border && 'border')}
    style={{ color }}
    {...args}
  />
);
