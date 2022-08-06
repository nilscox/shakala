import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';
import { ComponentProps } from 'react';

import { ThreadForm } from './thread-form';

export default {
  title: 'Domain/Thread/ThreadForm',
  decorators: [
    (Story) => (
      <div className="max-w-page">
        <Story />
      </div>
    ),
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
    description: 'Une description est requise',
    keywords: "L'un des mot clés est trop long (max : 20 caractères par mot clé)",
    text: 'Le texte est trop court',
  },
};
