import { ActionFunction, LoaderFunction } from '@remix-run/node';
import { useCatch, useLoaderData } from '@remix-run/react';

import { Thread } from '~/components/domain/thread/thread';
import { Fallback } from '~/components/elements/fallback';
import container from '~/server/inversify.config.server';
import { ThreadController } from '~/server/thread/thread.controller.server';
import { methodNotAllowed } from '~/server/utils/responses.server';

const controller = () => container.get(ThreadController);

export const loader: LoaderFunction = async ({ request, params }) => {
  return controller().getThread(request, params.threadId as string);
};

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    return controller().createComment(request);
  } else if (request.method === 'PUT') {
    return controller().updateComment(request);
  }

  return methodNotAllowed({ message: 'Only POST and PUT methods are allowed' });
};

export default function ThreadRoute() {
  const thread = useLoaderData();

  return <Thread thread={thread} />;
}

export const CatchBoundary = () => {
  const caught = useCatch();

  if (caught.status === 404) {
    return <Fallback>Cette page n'existe pas.</Fallback>;
  }

  throw caught;
};
