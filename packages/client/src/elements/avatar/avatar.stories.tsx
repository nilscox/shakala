import { Meta, StoryFn } from '@storybook/react';

import { controls } from '~/utils/storybook';

import { Avatar } from './avatar';
import { AvatarNick } from './avatar-nick';

type Args = {
  size: 'small' | 'medium' | 'big';
  loading: boolean;
  nick?: string;
};

export default {
  title: 'Elements/Avatar',
  args: {
    size: 'medium',
    loading: false,
  },
  argTypes: {
    size: controls.inlineRadio(['small', 'medium', 'big']),
    nick: controls.string(),
  },
} satisfies Meta<Args>;

export const avatar: StoryFn<Args> = ({ nick, ...args }) => {
  if (nick !== undefined) {
    return <AvatarNick nick={nick} {...args} />;
  }

  return <Avatar {...args} />;
};
