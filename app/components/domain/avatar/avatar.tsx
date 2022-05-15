import classNames from 'classnames';

import defaultAvatar from './default-avatar.png';

type AvatarProps = {
  big?: boolean;
  image?: string;
  className?: string;
};

export const Avatar = ({ big, image, className }: AvatarProps) => (
  <img
    src={image ?? defaultAvatar}
    className={classNames(
      'object-cover rounded-full border border-light-gray',
      big ? 'w-5 h-5' : 'w-4 h-4',
      className,
    )}
    alt="user-avatar"
  />
);
