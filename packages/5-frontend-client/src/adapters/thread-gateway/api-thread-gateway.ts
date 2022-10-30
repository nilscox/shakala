import { AuthorizationError, GetCommentsOptions, ReactionType, ThreadGateway } from 'frontend-domain';
import {
  CommentDto,
  CreateCommentBodyDto,
  CreateThreadBodyDto,
  EditCommentBodyDto,
  get,
  GetLastThreadsQueryDto,
  GetThreadQueryDto,
  ReportCommentBodyDto,
  SetReactionBodyDto,
  ThreadDto,
  ThreadWithCommentsDto,
} from 'shared';

import { HttpError, HttpGateway, Response } from '../http-gateway/http.gateway';

export class FetchError extends Error {
  constructor(public readonly response: Response<unknown>) {
    super('FetchError');
  }
}

export class ApiThreadGateway implements ThreadGateway {
  constructor(private readonly http: HttpGateway) {}

  async getLast(count: number): Promise<ThreadDto[]> {
    const response = await this.http.get<ThreadDto[], GetLastThreadsQueryDto>('/thread/last', {
      query: { count },
    });

    return response.body;
  }

  async getById(threadId: string): Promise<[ThreadDto, CommentDto[]] | undefined> {
    try {
      const response = await this.http.get<ThreadWithCommentsDto>(`/thread/${threadId}`);
      const { comments, ...thread } = response.body;

      return [thread, comments];
    } catch (error) {
      if (!HttpError.isHttpError(error, 404)) {
        throw error;
      }
    }
  }

  async getComments(threadId: string, options: GetCommentsOptions): Promise<CommentDto[] | undefined> {
    const response = await this.http.get<ThreadWithCommentsDto, GetThreadQueryDto>(`/thread/${threadId}`, {
      query: options as GetThreadQueryDto,
    });

    if (response.status === 404) {
      return;
    }

    if (response.status !== 200) {
      throw new FetchError(response);
    }

    return response.body.comments;
  }

  async createThread(description: string, text: string, keywords: string[]): Promise<string> {
    const response = await this.http.post<{ id: string }, CreateThreadBodyDto>('/thread', {
      body: { description, text, keywords },
    });

    if (response.status !== 201) {
      throw new FetchError(response);
    }

    return response.body.id;
  }

  async createComment(threadId: string, text: string): Promise<string> {
    const response = await this.http.post<{ id: string }, CreateCommentBodyDto>('/comment', {
      body: { threadId, text },
    });

    if (response.status !== 201) {
      throw new FetchError(response);
    }

    return response.body.id;
  }

  async createReply(threadId: string, parentId: string, text: string): Promise<string> {
    const response = await this.http.post<{ id: string }, CreateCommentBodyDto>('/comment', {
      body: { threadId, parentId, text },
    });

    if (response.status !== 201) {
      throw new FetchError(response);
    }

    return response.body.id;
  }

  async editComment(commentId: string, text: string): Promise<void> {
    const response = await this.http.put<void, EditCommentBodyDto>(`/comment/${commentId}`, {
      body: { text },
    });

    const code = get(response.body, 'code');

    if (response.status === 401 && code === 'UserMustBeAuthor') {
      throw new AuthorizationError(code);
    }

    if (response.status !== 204) {
      throw new FetchError(response);
    }
  }

  async setReaction(commentId: string, reactionType: ReactionType | null): Promise<void> {
    const response = await this.http.put<void, SetReactionBodyDto>(`/comment/${commentId}/reaction`, {
      body: { type: reactionType },
    });

    if (response.status !== 204) {
      throw new FetchError(response);
    }
  }

  async reportComment(commentId: string, reason?: string | undefined): Promise<void> {
    await this.http.post<void, ReportCommentBodyDto>(`/comment/${commentId}/report`, {
      body: { reason },
      onError: ({ response }) => {
        if (response.status === 400 && response.body.code === 'CommentAlreadyReported') {
          throw new AuthorizationError('CommentAlreadyReported');
        }
      },
    });
  }
}
