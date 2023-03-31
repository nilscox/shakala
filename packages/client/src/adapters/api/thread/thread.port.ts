import { CommentSort, Maybe, RootCommentDto, ThreadDto } from '@shakala/shared';

export interface ThreadPort {
  getLastThreads(count: number): Promise<ThreadDto[]>;
  getThread(threadId: string): Promise<Maybe<ThreadDto>>;
  getThreadComments(threadId: string, options?: GetThreadCommentsOptions): Promise<RootCommentDto[]>;
  createThread(fields: ThreadFormFields): Promise<string>;
}

export type GetThreadCommentsOptions = {
  sort?: CommentSort;
  search?: string;
};

export type ThreadFormFields = {
  description: string;
  keywords: string;
  text: string;
};
