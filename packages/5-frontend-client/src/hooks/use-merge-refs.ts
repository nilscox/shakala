import { ForwardedRef, useCallback } from 'react';

export const useMergeRefs = <T extends HTMLElement>(...refs: Array<ForwardedRef<T>>): ForwardedRef<T> => {
  return useCallback((element: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
