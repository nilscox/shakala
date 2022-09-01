import { Meta, Story } from '@storybook/react';
import { ComponentProps } from 'react';

import { Button } from '../button';

export default {
  title: 'Elements/Button',
} as Meta;

// eslint-disable-next-line react/no-children-prop
const Template: Story<ComponentProps<typeof Button>> = (props) => <Button children="Click me!" {...props} />;

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

export const disabled = Template.bind({});
disabled.args = {
  ...Template.args,
  primary: true,
  disabled: true,
};

export const loading = Template.bind({});
loading.args = {
  ...Template.args,
  primary: true,
  loading: true,
  disabled: true,
};
