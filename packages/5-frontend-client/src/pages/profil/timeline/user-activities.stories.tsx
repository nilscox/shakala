import { Meta } from '@storybook/react';

import { reduxDecorator, routerDecorator } from '~/utils/storybook';

import { UserActivities } from './user-activities';

export default {
  title: 'Domain/UserActivities',
  decorators: [reduxDecorator(), routerDecorator()],
} as Meta;

export const userActivities = () => <UserActivities />;
