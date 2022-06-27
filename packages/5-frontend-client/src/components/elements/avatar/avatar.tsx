import clsx from 'clsx';

import defaultAvatar from './default-avatar.png';

type AvatarProps = {
  big?: boolean;
  image?: string;
  className?: string;
};

export const Avatar = ({ big, image, className }: AvatarProps) => (
  <img
    src={image ?? defaultAvatar}
    className={clsx('object-cover rounded-full border', big ? 'w-6 h-6' : 'w-5 h-5', className)}
    alt="user-avatar"
  />
);
