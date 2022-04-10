import { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { Thread } from '~/components/domain/thread/thread';
import { Layout } from '~/components/layout/layout';
import { threadFacebookZetetique } from '~/thread-facebook-zetetique';

export const loader: LoaderFunction = () => {
  return threadFacebookZetetique;
};

export default function Index() {
  const thread = useLoaderData();

  return (
    <Layout>
      <Thread thread={thread} />
    </Layout>
  );
}
