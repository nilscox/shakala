import { clsx } from 'clsx';

import { Avatar } from './avatar';

type AvatarNickProps = {
  big?: boolean;
  image?: string;
  nick: string;
};

export const AvatarNick = ({ big, image, nick }: AvatarNickProps): JSX.Element => (
  <div className="flex flex-row items-center gap-2">
    <Avatar big={big} image={image} />
    <span className={clsx('font-medium text-muted', big && 'text-lg')}>{nick}</span>
  </div>
);
