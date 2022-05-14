import { json, LoaderFunction } from '@remix-run/node';
import { useCatch, useLoaderData } from '@remix-run/react';
import Container from 'typedi';

import { Thread } from '~/components/domain/thread/thread';
import { ThreadRepositoryToken } from '~/data/thread.repository';
import { Sort } from '~/types';

export class EntityNotFound extends Response {
  constructor(entity: string, readonly predicate?: unknown) {
    super(`${entity} not found`, { status: 404 });
  }
}

class SearchParams {
  private readonly searchParams: URLSearchParams;

  constructor(request: Request) {
    this.searchParams = new URL(request.url).searchParams;
  }

  getString(key: string): string | undefined {
    const value = this.searchParams.get(key);

    if (!value || typeof value !== 'string') {
      return;
    }

    return value;
  }
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const threadId = params.threadId as string;

  const searchParams = new SearchParams(request);
  const search = searchParams.getString('search');
  const sort = searchParams.getString('sort') === 'date' ? Sort.date : Sort.relevance;

  const threadRepository = Container.get(ThreadRepositoryToken);

  const thread = await threadRepository.findById(threadId);
  const comments = await threadRepository.findComments(threadId, sort, search);

  await new Promise((r) => setTimeout(r, 1000));

  if (!thread) {
    throw new EntityNotFound('thread');
  }

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
