import { useInjection } from 'brandi-react';
import { useEffect, useMemo, useState } from 'react';

import { usePageContext } from '~/app/page-context';

type RouterState = {
  pathname: string;
  searchParams: URLSearchParams;
  hash: string;
};

export const useRouter = (): RouterState => {
  const context = usePageContext();

  return useMemo(
    () => ({
      pathname: context.urlPathname,
      searchParams: new URLSearchParams(context.urlParsed.searchOriginal ?? undefined),
      hash: context.urlParsed.hash,
    }),
    [context]
  );
};

export const usePathname = () => {
  return useRouter().pathname;
};

export const useSearchParams = () => {
  return new URLSearchParams(useRouter().searchParams);
};

export const useHash = () => {
  const router = useInjection(TOKENS.router);
  const pageContext = usePageContext();
  const [hash, setHash] = useState(pageContext.urlParsed.hash);

  useEffect(() => {
    return router.onHashChange(setHash);
  }, [router]);

  return hash;
};

export const useNavigate = () => {
  const router = useInjection(TOKENS.router);
  return router.navigate.bind(router);
};
