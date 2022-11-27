import { routerSelectors } from 'frontend-domain';

import { useAppSelector } from '~/hooks/use-app-selector';
import { usePathname } from '~/hooks/use-pathname';

import { Link } from './link';

type SearchParamLinkProps = Omit<React.ComponentProps<typeof Link>, 'href'> & {
  param: string;
  value: string;
  disabled?: boolean;
};

export const SearchParamLink = ({ param, value, disabled, ...props }: SearchParamLinkProps) => {
  const pathname = usePathname();

  const searchParams = new URLSearchParams(
    useAppSelector(routerSelectors.queryParams) as Record<string, string>,
  );

  searchParams.set(param, value);

  if (disabled) {
    return <span aria-disabled {...props} />;
  }

  return <Link href={[pathname, searchParams].join('?')} {...props} />;
};
