import { Meta } from '@storybook/react';
import { createAuthUser, userProfileActions } from '@shakala/frontend-domain';

import { maxWidthDecorator, reduxDecorator, ReduxStory } from '../../utils/storybook';

import { ThreadForm } from './thread-form';

export default {
  title: 'Domain/ThreadForm',
  decorators: [maxWidthDecorator(), reduxDecorator()],
} as Meta;

export const threadForm: ReduxStory = () => <ThreadForm />;
threadForm.args = {
  setup(dispatch, getState, { threadGateway }) {
    dispatch(userProfileActions.setAuthenticatedUser(createAuthUser()));
    threadGateway.createThread.resolve('threadId', 1000);
  },
};
