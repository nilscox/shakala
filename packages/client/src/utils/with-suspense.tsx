import { ForwardedRef, forwardRef, Suspense } from 'react';

export const withSuspense = <Ref, Props>(
  Component: React.ComponentType<{ ref: ForwardedRef<Ref> } & Props>,
  displayName?: string
) => {
  const WithSuspense = forwardRef<Ref, Props>((props, ref) => (
    <Suspense fallback={<div className="col min-h-1 items-center justify-center">Loading...</div>}>
      <Component ref={ref} {...props} />
    </Suspense>
  ));

  if (displayName) {
    Component.displayName = displayName;
    WithSuspense.displayName = `withSuspense(${displayName})`;
  } else {
    WithSuspense.displayName = `withSuspense()`;
  }

  return WithSuspense;
};
