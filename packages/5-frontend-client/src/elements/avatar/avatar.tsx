import { clsx } from 'clsx';

import defaultAvatar from './default-avatar.png';

type AvatarProps = {
  loading?: boolean;
  size?: 'small' | 'medium' | 'big';
  image?: string;
  className?: string;
};

export const Avatar = ({ loading, size = 'small', image, className }: AvatarProps) => {
  const img = (
    <img
      src={image ?? defaultAvatar}
      className={clsx(
        'bg-neutral rounded-full border object-cover',
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

  if (!loading) {
    return img;
  }

  return (
    <div className="relative inline-block">
      {img}
      <div className="absolute inset-0 animate-spin rounded-full border-2 border-t-primary " />
    </div>
  );
};
