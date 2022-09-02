import { useSearchParams } from 'react-router-dom';

import { Link } from '~/components/elements/link';

type SearchParamLinkProps = Omit<React.ComponentProps<typeof Link>, 'to'> & {
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
