import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';
import { ComponentProps } from 'react';

import { routerDecorator } from '~/utils/storybook';

import { ThreadForm } from './thread-form';

export default {
  title: 'Domain/Thread/ThreadForm',
  decorators: [
    (Story) => (
      <div className="max-w-6">
        <Story />
      </div>
    ),
    routerDecorator(),
  ],
} as Meta;

const Template: Story<ComponentProps<typeof ThreadForm>> = (props) => <ThreadForm {...props} />;
Template.args = {
  errors: {},
  onChange: action('onChange'),
  onSubmit: action('onSubmit'),
};

export const threadForm = Template.bind({});
threadForm.args = Template.args;

export const withErrors = Template.bind({});
withErrors.args = {
  ...Template.args,
  errors: {
    description: 'min',
    keywords: 'max',
    text: 'min',
  },
};
