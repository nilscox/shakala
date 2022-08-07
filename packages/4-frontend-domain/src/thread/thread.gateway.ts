import { CommentDto, ReactionTypeDto, Sort, ThreadDto } from 'shared';

export type GetCommentsOptions = Partial<{
  search: string;
  sort: Sort;
}>;

export interface ThreadGateway {
  getLast(count: number): Promise<ThreadDto[]>;
  getById(threadId: string): Promise<[ThreadDto, CommentDto[]] | undefined>;
  createThread(description: string, text: string, keywords: string[]): Promise<string>;
  getComments(threadId: string, options?: GetCommentsOptions): Promise<CommentDto[] | undefined>;
  createComment(threadId: string, text: string): Promise<string>;
  createReply(threadId: string, parentId: string, text: string): Promise<string>;
  editComment(commentId: string, text: string): Promise<void>;
  setReaction(commentId: string, reactionType: ReactionTypeDto | null): Promise<void>;
}
