'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export const useSearchParam = (name: string) => {
  const params = useSearchParams();

  return params.get(name) ?? undefined;
};

export const useSetSearchParam = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  return useCallback(
    (key: string, value: string | undefined) => {
      const nextParams = new URLSearchParams(params);

      if (value === undefined) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }

      router.push(`${pathname}?${nextParams}`);
    },
    [pathname, params, router],
  );
};
