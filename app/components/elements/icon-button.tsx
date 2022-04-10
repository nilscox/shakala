import classNames from 'classnames';
import { cloneElement } from 'react';

import { Button, ButtonProps } from './button';

export type IconButtonProps = ButtonProps & {
  icon: JSX.Element;
};

export const IconButton = ({ icon, small, className, children, ...props }: IconButtonProps) => (
  <Button
    small={small}
    className={classNames('flex flex-row items-center fill-text-light hover:fill-primary', className)}
    {...props}
  >
    {cloneElement(icon, { className: classNames('mr-0.5', small ? 'w-3 h-3' : 'w-4 h-4') })}
    {children}
  </Button>
);
