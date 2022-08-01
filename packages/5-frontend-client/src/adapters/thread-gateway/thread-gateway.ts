import { AuthorizationError, GetCommentsOptions, ReactionType, ThreadGateway } from 'frontend-domain';
import { CommentDto, get, ReactionTypeDto, ThreadDto, ThreadWithCommentsDto } from 'shared';

import { HttpGateway, Response } from '../http-gateway/http.gateway';

export class FetchError extends Error {
  constructor(public readonly response: Response<unknown>) {
    super('FetchError');
  }
}

export class ApiThreadGateway implements ThreadGateway {
  constructor(private readonly http: HttpGateway) {}

  async getLast(count: number): Promise<ThreadDto[]> {
    const response = await this.http.get<ThreadDto[]>('/thread/last', {
      query: { count },
    });

    return response.body;
  }

  async getById(threadId: string): Promise<[ThreadDto, CommentDto[]] | undefined> {
    const response = await this.http.get<ThreadWithCommentsDto>(`/thread/${threadId}`);

    if (response.status === 404) {
      return;
    }

    if (response.status !== 200) {
      throw new FetchError(response);
    }

    const { comments, ...thread } = response.body;

    return [thread, comments];
  }

  async getComments(threadId: string, options: GetCommentsOptions): Promise<CommentDto[] | undefined> {
    const response = await this.http.get<ThreadWithCommentsDto>(`/thread/${threadId}`, { query: options });

    if (response.status === 404) {
      return;
    }

    if (response.status !== 200) {
      throw new FetchError(response);
    }

    return response.body.comments;
  }

  async createComment(threadId: string, text: string): Promise<string> {
    const response = await this.http.post<{ text: string }, string>(`/thread/${threadId}/comment`, {
      body: { text },
    });

    if (response.status !== 201) {
      throw new FetchError(response);
    }

    return response.body;
  }

  async createReply(threadId: string, parentId: string, text: string): Promise<string> {
    const response = await this.http.post<{ parentId: string; text: string }, string>(
      `/thread/${threadId}/comment`,
      {
        body: { parentId, text },
      },
    );

    if (response.status !== 201) {
      throw new FetchError(response);
    }

    return response.body;
  }

  async editComment(threadId: string, commentId: string, text: string): Promise<void> {
    const response = await this.http.put<{ text: string }>(`/thread/${threadId}/comment/${commentId}`, {
      body: { text },
    });

    const code = get(response.body, 'message');

    if (response.status === 401 && code === 'UserMustBeAuthor') {
      throw new AuthorizationError(code);
    }

    if (response.status !== 204) {
      throw new FetchError(response);
    }
  }

  async setReaction(threadId: string, commentId: string, reactionType: ReactionType | null): Promise<void> {
    const response = await this.http.put<{ type: ReactionTypeDto | null }>(
      `/thread/${threadId}/comment/${commentId}/reaction`,
      { body: { type: reactionType } },
    );

    if (response.status !== 204) {
      throw new FetchError(response);
    }
  }
}
