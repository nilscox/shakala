import { HTMLProps } from 'react';
import { Link as RRLink } from 'react-router-dom';

export const Link = RRLink;

export const ExternalLink = ({ children, ...props }: HTMLProps<HTMLAnchorElement>) => (
  <a {...props}>{children}</a>
);
