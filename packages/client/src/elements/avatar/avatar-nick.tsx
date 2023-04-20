import { contains } from '@shakala/shared';
import { clsx } from 'clsx';
import { ComponentProps } from 'react';

import { Avatar } from './avatar';

type AvatarNickProps = Pick<ComponentProps<typeof Avatar>, 'size' | 'image'> & {
  nick: string;
};

export const AvatarNick = ({ nick, ...props }: AvatarNickProps): JSX.Element => (
  <div className="flex flex-row items-center gap-1">
    <Avatar {...props} />
    <span className={clsx('font-medium text-muted', contains(['medium', 'big'], props.size) && 'text-lg')}>
      {nick}
    </span>
  </div>
);
