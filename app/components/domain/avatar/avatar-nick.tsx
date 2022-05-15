import classNames from 'classnames';

import { User } from '~/types';

import { Avatar } from './avatar';

type AvatarNickProps = {
  big?: boolean;
  user: User;
};

export const AvatarNick = ({ big, user }: AvatarNickProps): JSX.Element => (
  <div className="flex flex-row gap-2 items-center">
    <Avatar big={big} image={user.image} />
    <span className={classNames('font-medium text-text-light', big && 'text-lg')}>{user.nick}</span>
  </div>
);
