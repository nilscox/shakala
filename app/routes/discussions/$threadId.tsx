import { json, LoaderFunction } from '@remix-run/node';
import { useCatch, useLoaderData } from '@remix-run/react';
import Container from 'typedi';

import { Thread } from '~/components/domain/thread/thread';
import { ThreadRepositoryToken } from '~/data/thread.repository';

export class EntityNotFound extends Response {
  constructor(entity: string, readonly predicate?: unknown) {
    super(`${entity} not found`, { status: 404 });
  }
}

export const loader: LoaderFunction = async ({ params }) => {
  const thread = await Container.get(ThreadRepositoryToken).findById(params.threadId as string);

  if (!thread) {
    throw new EntityNotFound('thread');
  }

  return json(thread);
};

export default function ThreadRoute() {
  const thread = useLoaderData();

  return <Thread thread={thread} />;
}

export const CatchBoundary = () => {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="flex justify-center items-center min-h-[220px]">
        <strong>Cette page n'existe pas.</strong>
      </div>
    );
  }

  throw caught;
};
