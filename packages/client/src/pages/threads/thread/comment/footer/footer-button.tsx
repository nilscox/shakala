import { clsx } from 'clsx';

import { IconButton, IconButtonProps } from '~/elements/icon-button';
import { SearchParamLink } from '~/elements/link';

type FooterButtonProps = IconButtonProps & {
  active?: boolean;
};

export const FooterButton = ({ className, active, ...props }: FooterButtonProps) => (
  <IconButton secondary small className={clsx(active && '!text-primary', className)} {...props} />
);

type FooterButtonLinkProps = React.ComponentProps<typeof SearchParamLink> & {
  icon?: React.ReactElement;
};

export const FooterButtonLink = ({ icon, children, ...props }: FooterButtonLinkProps) => (
  <SearchParamLink
    className={clsx(
      'row button-secondary button items-center fill-muted p-0 text-xs',
      !props.disabled && 'hover:fill-primary hover:text-primary',
      props.disabled && '!cursor-default !text-muted/60'
    )}
    {...props}
  >
    {icon}
    {children}
  </SearchParamLink>
);
