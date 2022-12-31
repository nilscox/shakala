import { Sort } from '@shakala/shared';

import { Comment } from '../modules/comment';
import { Thread } from '../modules/thread';

export type FetchCommentsFilters = Partial<{
  search: string;
  sort: Sort;
}>;

export interface ThreadGateway {
  fetchLast(count: number): Promise<Thread[]>;
  fetchThread(threadId: string): Promise<Thread | undefined>;
  fetchComments(threadId: string, filters?: FetchCommentsFilters): Promise<Comment[]>;
  createThread(description: string, keywords: string[], text: string): Promise<string>;
  createComment(threadId: string, text: string): Promise<string>;
}
