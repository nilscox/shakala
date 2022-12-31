import { Meta, StoryFn } from '@storybook/react';
import { ComponentProps } from 'react';

import { Button } from '../button';

export default {
  title: 'Elements/Button',
} as Meta;

const Template: StoryFn<ComponentProps<typeof Button>> = (props) => {
  return <Button {...props}>Click me!</Button>;
};

export const primary = Template.bind({});
primary.args = {
  ...Template.args,
  primary: true,
};

export const secondary = Template.bind({});
secondary.args = {
  ...Template.args,
  secondary: true,
};

export const small = Template.bind({});
small.args = {
  ...Template.args,
  primary: true,
  small: true,
};

export const primaryDisabled = Template.bind({});
primaryDisabled.args = {
  ...Template.args,
  primary: true,
  disabled: true,
};

export const secondaryDisabled = Template.bind({});
secondaryDisabled.args = {
  ...Template.args,
  secondary: true,
  disabled: true,
};

export const loading = Template.bind({});
loading.args = {
  ...Template.args,
  primary: true,
  loading: true,
  disabled: true,
};
