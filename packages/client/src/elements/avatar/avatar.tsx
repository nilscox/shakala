import { clsx } from 'clsx';

const defaultProfileImage = `https://www.gravatar.com/avatar?default=mp`;

type AvatarProps = {
  image?: string;
  loading?: boolean;
  size?: 'small' | 'medium' | 'big';
  className?: string;
};

export const Avatar = ({ image, loading, size = 'small', className }: AvatarProps) => {
  const img = (
    <img
      src={image ?? defaultProfileImage}
      className={clsx(
        'rounded-full border bg-neutral object-cover',
        {
          'h-5 w-5': size === 'small',
          'h-6 w-6': size === 'medium',
          'h-8 w-8': size === 'big',
        },
        className
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
