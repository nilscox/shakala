import { ComponentMeta, Story } from '@storybook/react';

import { controls } from '~/utils/storybook';

import { Avatar } from './avatar';
import { AvatarNick } from './avatar-nick';

export default {
  title: 'Elements/Avatar',
  component: Avatar,
  argTypes: {
    size: controls.inlineRadio(['small', 'medium', 'big'], 'medium'),
    loading: controls.boolean(false),
    image: controls.disabled(),
    className: controls.disabled(),
  },
} as ComponentMeta<typeof Avatar>;

type AvatarStoryArgs = Pick<React.ComponentProps<typeof Avatar>, 'size' | 'loading'>;

export const avatar: Story<AvatarStoryArgs> = (args) => <Avatar {...args} />;
export const withNick: Story<AvatarStoryArgs> = (args) => <AvatarNick nick="Nick" {...args} />;
