import { Meta, Story } from '@storybook/react';
import { clsx } from 'clsx';

import { controls } from '../../../utils/storybook';

import { Logo } from './logo';

const font = 'https://fonts.googleapis.com/css2?family=Concert+One';

export default {
  title: 'Domain/Logo',
  argTypes: {
    debug: controls.boolean(false),
    border: controls.boolean(false),
    color: controls.text('#000000'),
    size: controls.range(8, { min: 1, max: 100 }),
    className: controls.disabled(),
  },
  decorators: [
    (Story) => (
      <>
        <style>{`@import url('${font}');`}</style>
        <Story />
      </>
    ),
  ],
} as Meta;

type Args = {
  debug: boolean;
  border: boolean;
  color: string;
  size: number;
  className?: string;
};

export const logo: Story<Args> = ({ border, color, size, ...args }) => (
  <Logo
    width={size * 24}
    height={size * 14}
    className={clsx(border && 'border')}
    style={{ color }}
    {...args}
  />
);
