import { Meta, StoryFn } from '@storybook/react';

import { controls } from '../../utils/storybook';

import { Avatar } from './avatar';
import { AvatarNick } from './avatar-nick';

type Args = {
  size: 'small' | 'medium' | 'big';
  loading: boolean;
  nick?: string;
};

export default {
  title: 'Elements/Avatar',
  ...controls<Args>(({ inlineRadio, boolean, string }) => ({
    size: inlineRadio(['small', 'medium', 'big'], 'medium'),
    loading: boolean(false),
    nick: string(),
  })),
} satisfies Meta<Args>;

export const avatar: StoryFn<Args> = ({ nick, ...args }) => {
  if (nick !== undefined) {
    return <AvatarNick nick={nick} {...args} />;
  }

  return <Avatar {...args} />;
};
