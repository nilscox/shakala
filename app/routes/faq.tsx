import { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { Layout } from '~/components/layout/layout';
import { getUser } from '~/server/session.server';
import { User } from '~/types';

type LoaderData = {
  user?: User;
};

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => ({
  user: await getUser(request),
});

export default function FaqRoute() {
  const { user } = useLoaderData();

  return <Layout user={user}>FAQ</Layout>;
}
