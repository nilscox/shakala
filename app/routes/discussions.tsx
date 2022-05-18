import { LoaderFunction } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';

import { Layout } from '~/components/layout/layout';
import { getUserId } from '~/lib/utils.server';

export const loader: LoaderFunction = async ({ request }) => {
  return {
    user: await getUserId(request),
  };
};

export default function ThreadRoute() {
  const data = useLoaderData();

  console.log(data.user);

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
