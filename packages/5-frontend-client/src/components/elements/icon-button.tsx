import clsx from 'clsx';
import { cloneElement } from 'react';

import { Button, ButtonProps } from './button';

export type IconButtonProps = ButtonProps & {
  icon: JSX.Element;
};

export const IconButton = ({ icon, small, className, children, ...props }: IconButtonProps) => (
  <Button small={small} className={clsx('items-center row', className)} {...props}>
    {cloneElement(icon, {
      className: clsx('mr-0.5', small ? 'w-4 h-4' : 'w-4 h-4', icon.props.className),
    })}
    {children}
  </Button>
);
