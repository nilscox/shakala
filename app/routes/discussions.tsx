import { Outlet } from '@remix-run/react';

import { Layout } from '~/components/layout/layout';

export default function ThreadRoute() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
