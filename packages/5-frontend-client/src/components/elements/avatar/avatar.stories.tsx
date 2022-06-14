import { ComponentMeta } from '@storybook/react';

import { Avatar } from './avatar';
import { AvatarNick } from './avatar-nick';

export default {
  title: 'Elements/Avatar',
  component: Avatar,
} as ComponentMeta<typeof Avatar>;

export const avatar = () => <Avatar />;

export const big = () => <Avatar big />;

export const withNick = () => <AvatarNick nick="Nick" />;
