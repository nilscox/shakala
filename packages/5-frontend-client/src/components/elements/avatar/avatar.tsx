import { clsx } from 'clsx';

import defaultAvatar from './default-avatar.png';

type AvatarProps = {
  size?: 'small' | 'medium' | 'big';
  image?: string;
  className?: string;
};

export const Avatar = ({ size = 'small', image, className }: AvatarProps) => (
  <img
    src={image ?? defaultAvatar}
    className={clsx(
      'rounded-full border object-cover',
      {
        'h-5 w-5': size === 'small',
        'h-6 w-6': size === 'medium',
        'h-8 w-8': size === 'big',
      },
      className,
    )}
    alt="user-avatar"
  />
);
