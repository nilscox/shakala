import { ForwardedRef, forwardRef, Suspense } from 'react';

export const withSuspense = <Ref, Props>(
  Component: React.ComponentType<{ ref: ForwardedRef<Ref> } & Props>
) => {
  const WithSuspense = forwardRef<Ref, Props>((props, ref) => (
    <Suspense fallback={<div className="col min-h-1 items-center justify-center">Loading...</div>}>
      <Component ref={ref} {...props} />
    </Suspense>
  ));

  WithSuspense.displayName = `withSuspense(${Component.name})`;

  return WithSuspense;
};
