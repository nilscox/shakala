import { json, LoaderFunction } from '@remix-run/node';
import { useCatch, useLoaderData } from '@remix-run/react';
import Container from 'typedi';

import { Thread } from '~/components/domain/thread/thread';
import { ThreadRepositoryToken } from '~/data/thread.repository';
import { SearchParams } from '~/lib/search-params';
import { Sort } from '~/types';

export class EntityNotFound extends Response {
  constructor(entity: string, readonly predicate?: unknown) {
    super(`${entity} not found`, { status: 404 });
  }
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const threadId = params.threadId as string;

  const searchParams = new SearchParams(request);
  const search = searchParams.getString('search');
  const sort = searchParams.getEnum('sort', Sort) ?? Sort.dateAsc;

  const threadRepository = Container.get(ThreadRepositoryToken);

  const thread = await threadRepository.findById(threadId);

  if (!thread) {
    throw new EntityNotFound('thread');
  }

  const comments = await threadRepository.findComments(threadId, sort, search);

  return json({
    ...thread,
    comments,
  });
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
