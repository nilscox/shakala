import { Meta, StoryFn } from '@storybook/react';

import { controls } from '~/utils/storybook';

import { Button } from '../button';

type Args = {
  variant: 'primary' | 'secondary';
  small: boolean;
  disabled: boolean;
  loading: boolean;
};

export default {
  title: 'Elements/Button',
  args: {
    variant: 'primary',
    small: false,
    disabled: false,
    loading: false,
  },
  argTypes: {
    variant: controls.inlineRadio(['primary', 'secondary']),
  },
} satisfies Meta<Args>;

export const button: StoryFn<Args> = ({ variant, ...props }) => {
  return (
    <Button primary={variant === 'primary'} secondary={variant === 'secondary'} {...props}>
      Click me!
    </Button>
  );
};
