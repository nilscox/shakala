import { Link, LinkProps, useSearchParams } from '@remix-run/react';

type SearchParamLinkProps = Omit<LinkProps, 'to'> & {
  param: string;
  value: string;
};

export const SearchParamLink = ({ param, value, ...props }: SearchParamLinkProps) => {
  const [searchParams] = useSearchParams();

  searchParams.set(param, value);

  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <Link to={{ search: searchParams.toString() }} {...props} />;
};
