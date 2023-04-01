import { Meta, StoryFn } from '@storybook/react';

import IconProfile from '~/icons/profile.svg';
import IconSignOut from '~/icons/sign-out.svg';
import IconSubscribe from '~/icons/subscribe.svg';

import { Chip } from '../chip';
import { VerticalTab, VerticalTabs } from '../vertical-tabs';

export default {
  title: 'Elements/VerticalTabs',
  parameters: {
    pageContext: {
      pathname: '/profil/notifications',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-1">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export const verticalTabs: StoryFn = () => (
  <VerticalTabs>
    <VerticalTab to="/profil" Icon={IconProfile}>
      Profil
    </VerticalTab>

    <VerticalTab to="/profil/notifications" Icon={IconSubscribe}>
      Notifications
      <Chip className="ml-auto">3</Chip>
    </VerticalTab>

    <VerticalTab Icon={IconSignOut}>Déconnexion</VerticalTab>
  </VerticalTabs>
);
