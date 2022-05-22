import { ActionFunction, json, LoaderFunction } from '@remix-run/node';
import { useCatch, useLoaderData } from '@remix-run/react';

import { Thread } from '~/components/domain/thread/thread';
import { Fallback } from '~/components/elements/fallback';
import { ThreadRepository, ThreadRepositoryToken } from '~/data/thread.repository.server';
import container from '~/inversify.config.server';
import { ThreadController } from '~/server/thread/thread.controller.server';
import { methodNotAllowed } from '~/server/utils/responses';
import { SearchParams } from '~/server/utils/search-params';
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

  const threadRepository = container.get<ThreadRepository>(ThreadRepositoryToken);

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

export const action: ActionFunction = async ({ request }) => {
  const controller = container.get(ThreadController);

  if (request.method === 'POST') {
    return controller.createComment(request);
  } else if (request.method === 'PUT') {
    return controller.updateComment(request);
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
