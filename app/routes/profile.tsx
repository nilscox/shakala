import { LoaderFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';

import { Layout } from '~/components/layout/layout';
import { requireUser } from '~/server/session.server';
import { User } from '~/types';

type LoaderData = {
  user: User;
};

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => ({
  user: await requireUser(request),
});

export default function ProfileRoute() {
  const { user } = useLoaderData();

  return (
    <Layout user={user}>
      <h2 className="my-5 text-xl font-bold">{user.nick}</h2>
      <Form method="post" action="/user/logout">
        <button>Déconnexion</button>
      </Form>
    </Layout>
  );
}
