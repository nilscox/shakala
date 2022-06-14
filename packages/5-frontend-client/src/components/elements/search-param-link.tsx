import { Link, LinkProps, useSearchParams } from 'react-router-dom';

type SearchParamLinkProps = Omit<LinkProps, 'to'> & {
  param: string;
  value: string;
  enableScrollRestoration?: boolean;
};

export const SearchParamLink = ({
  param,
  value,
  enableScrollRestoration = false,
  ...props
}: SearchParamLinkProps) => {
  const [searchParams] = useSearchParams();

  searchParams.set(param, value);

  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <Link to={{ search: searchParams.toString() }} state={{ scroll: enableScrollRestoration }} {...props} />
  );
};
