import { Meta, Story } from '@storybook/react';
import { ComponentProps } from 'react';

import { AsyncResource } from './async-resource';

export default {
  title: 'Elements/AsyncResource',
} as Meta;

const Template: Story<ComponentProps<typeof AsyncResource>> = (props) => (
  <AsyncResource {...props} render={(data) => <>Hello {data}!</>} />
);

export const withData = Template.bind({});
withData.args = {
  data: 'world',
};

export const withError = Template.bind({});
withError.args = {
  error: 'Oops',
  renderError: (error) => <>Error: {error}</>,
};

export const loading = Template.bind({});
loading.args = {
  data: undefined,
  loading: true,
};

export const loadingWithData = Template.bind({});
loadingWithData.args = {
  data: 'world',
  loading: true,
};
