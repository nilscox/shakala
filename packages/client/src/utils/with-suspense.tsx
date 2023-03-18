import { ForwardedRef, forwardRef, Suspense } from 'react';

export const withSuspense = <Ref, Props>(
  Component: React.ComponentType<{ ref: ForwardedRef<Ref> } & Props>
) => {
  return forwardRef<Ref, Props>((props, ref) => (
    <Suspense fallback={<>Loading...</>}>
      <Component ref={ref} {...props} />
    </Suspense>
  ));
};
