import { clsx } from 'clsx';

import { IconButton, IconButtonProps } from '~/elements/icon-button';

type FooterButtonProps = IconButtonProps & {
  active?: boolean;
};

export const FooterButton = ({ className, active, ...props }: FooterButtonProps) => (
  <IconButton secondary small className={clsx(active && '!text-primary', className)} {...props} />
);
