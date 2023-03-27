import { Meta, StoryFn } from '@storybook/react';

import { controls } from '~/utils/storybook';

import { Button } from '../button';

type Args = {
  primary: boolean;
  secondary: boolean;
  small: boolean;
  disabled: boolean;
  loading: boolean;
};

export default {
  title: 'Elements/Button',
  ...controls<Args>(({ boolean }) => ({
    primary: boolean(true),
    secondary: boolean(false),
    small: boolean(false),
    disabled: boolean(false),
    loading: boolean(false),
  })),
} satisfies Meta<Args>;

export const button: StoryFn<Args> = (props) => {
  return <Button {...props}>Click me!</Button>;
};
