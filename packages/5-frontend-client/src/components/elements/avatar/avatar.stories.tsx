import { ComponentMeta } from '@storybook/react';

import { Avatar } from './avatar';
import { AvatarNick } from './avatar-nick';

export default {
  title: 'Elements/Avatar',
  component: Avatar,
} as ComponentMeta<typeof Avatar>;

export const small = () => <Avatar />;
export const medium = () => <Avatar size="medium" />;
export const big = () => <Avatar size="big" />;

export const withNick = () => <AvatarNick nick="Nick" />;
