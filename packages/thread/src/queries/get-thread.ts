import { queryCreator, QueryHandler, registerQuery } from '@shakala/common';
import { CommentSort, Maybe } from '@shakala/shared';
import { injected } from 'brandi';

import { ThreadRepository } from '../repositories/thread/thread.repository';
import { THREAD_TOKENS } from '../tokens';

import { GetCommentResult } from './get-comment';

export type GetThreadQuery = {
  threadId: string;
  userId?: string;
  sort: CommentSort;
  search?: string;
};

export type GetThreadResult = {
  id: string;
  author: {
    id: string;
    nick: string;
    profileImage: string;
  };
  description: string;
  keywords: string[];
  text: string;
  date: string;
  comments: GetCommentResult[];
};

export const getThread = queryCreator<GetThreadQuery, Maybe<GetThreadResult>>('getThread');

export class GetThreadHandler implements QueryHandler<GetThreadQuery, Maybe<GetThreadResult>> {
  constructor(private readonly threadRepository: ThreadRepository) {}

  async handle(query: GetThreadQuery): Promise<Maybe<GetThreadResult>> {
    return this.threadRepository.getThread(query.threadId, query);
  }
}

injected(GetThreadHandler, THREAD_TOKENS.repositories.threadRepository);
registerQuery(getThread, THREAD_TOKENS.queries.getThreadHandler);
