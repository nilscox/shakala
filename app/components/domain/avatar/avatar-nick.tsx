import classNames from 'classnames';

import { Avatar } from './avatar';

type AvatarNickProps = {
  big?: boolean;
  image?: string;
  nick: string;
};

export const AvatarNick = ({ big, image, nick }: AvatarNickProps): JSX.Element => (
  <div className="flex flex-row gap-2 items-center">
    <Avatar big={big} image={image} />
    <span className={classNames('font-medium text-text-light', big && 'text-lg')}>{nick}</span>
  </div>
);
