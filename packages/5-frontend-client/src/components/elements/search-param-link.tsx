import { usePathname, useSearchParams } from 'next/navigation';

import { Link } from './link';

type SearchParamLinkProps = Omit<React.ComponentProps<typeof Link>, 'href'> & {
  param: string;
  value: string;
  disabled?: boolean;
};

export const SearchParamLink = ({ param, value, disabled, ...props }: SearchParamLinkProps) => {
  const pathname = usePathname();
  const searchParams = new URLSearchParams(Array.from(useSearchParams().entries()));

  searchParams.set(param, value);

  if (disabled) {
    return <span aria-disabled {...props} />;
  }

  return <Link href={{ pathname, search: searchParams.toString() }} {...props} />;
};
