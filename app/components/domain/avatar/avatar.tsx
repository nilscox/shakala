import classNames from 'classnames';

import { User } from '~/types';

type AvatarProps = {
  big?: boolean;
  user: User;
};

export const Avatar = ({ big, user }: AvatarProps): JSX.Element => (
  <img
    src={user.image}
    className={classNames('object-cover rounded-full border border-light-gray', big ? 'w-5 h-5' : 'w-4 h-4')}
    alt="user-avatar"
  />
);
