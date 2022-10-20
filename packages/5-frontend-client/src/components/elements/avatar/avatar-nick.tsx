import { clsx } from 'clsx';
import { ComponentProps } from 'react';

import { Avatar } from './avatar';

type AvatarNickProps = Pick<ComponentProps<typeof Avatar>, 'size' | 'image'> & {
  nick: string;
};

export const AvatarNick = ({ size, image, nick }: AvatarNickProps): JSX.Element => (
  <div className="flex flex-row items-center gap-2">
    <Avatar size={size} image={image} />
    <span className={clsx('font-medium text-muted', size !== 'small' && 'text-lg')}>{nick}</span>
  </div>
);
