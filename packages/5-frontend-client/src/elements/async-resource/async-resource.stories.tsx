import { Meta, Story } from '@storybook/react';

import { controls } from '../../utils/storybook';

import { AsyncResource } from './async-resource';

export default {
  title: 'Elements/AsyncResource',
} as Meta;

type Args = {
  loading: boolean;
};

export const asyncResource: Story<Args> = (args) => (
  <AsyncResource loader={(show) => show && <>Loading...</>} {...args}>
    {() => <>Hello !</>}
  </AsyncResource>
);

asyncResource.argTypes = {
  loading: controls.boolean(false),
};
