import { Link, LinkProps, useSearchParams } from 'react-router-dom';

type SearchParamLinkProps = Omit<LinkProps, 'to'> & {
  param: string;
  value: string;
  disabled?: boolean;
  enableScrollRestoration?: boolean;
};

export const SearchParamLink = ({
  param,
  value,
  disabled,
  enableScrollRestoration = false,
  ...props
}: SearchParamLinkProps) => {
  const [searchParams] = useSearchParams();

  searchParams.set(param, value);

  if (disabled) {
    return <span aria-disabled {...props} />;
  }

  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <Link to={{ search: searchParams.toString() }} state={{ scroll: enableScrollRestoration }} {...props} />
  );
};
