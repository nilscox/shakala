import { clsx } from 'clsx';

import { Avatar } from './avatar';

type AvatarNickProps = {
  big?: boolean;
  image?: string;
  nick: string;
};

export const AvatarNick = ({ big, image, nick }: AvatarNickProps): JSX.Element => (
  <div className="flex flex-row gap-2 items-center">
    <Avatar big={big} image={image} />
    <span className={clsx('font-medium text-muted', big && 'text-lg')}>{nick}</span>
  </div>
);
