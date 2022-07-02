import { Comment, GetCommentsOptions, Thread, ThreadGateway } from 'frontend-domain';
import { CommentWithRepliesDto, ThreadDto, ThreadWithCommentDto } from 'shared';

import { HttpGateway, Response } from '../http-gateway/http.gateway';

export class FetchError extends Error {
  constructor(public readonly response: Response<unknown>) {
    super('FetchError');
  }
}

export class ApiThreadGateway implements ThreadGateway {
  constructor(private readonly http: HttpGateway) {}

  async getLast(count: number): Promise<Thread[]> {
    const response = await this.http.get<ThreadDto[]>('/thread/last', {
      query: { count },
    });

    return response.body.map(this.threadDtoToEntity);
  }

  async getById(threadId: string): Promise<[Thread, Comment[]] | undefined> {
    const response = await this.http.get<ThreadWithCommentDto>(`/thread/${threadId}`);

    if (response.status === 404) {
      return;
    }

    if (response.status !== 200) {
      throw new FetchError(response);
    }

    const { comments, ...thread } = response.body;

    return [this.threadDtoToEntity(thread), comments.map(this.commentDtoToEntity)];
  }

  async getComments(threadId: string, options: GetCommentsOptions): Promise<Comment[] | undefined> {
    const response = await this.http.get<ThreadWithCommentDto>(`/thread/${threadId}`, { query: options });

    if (response.status === 404) {
      return;
    }

    if (response.status !== 200) {
      throw new FetchError(response);
    }

    return response.body.comments.map(this.commentDtoToEntity);
  }

  async createComment(threadId: string, text: string): Promise<string> {
    const response = await this.http.post<{ text: string }, { id: string }>(`/thread/${threadId}/comment`, {
      body: { text },
    });

    if (response.status !== 201) {
      throw new FetchError(response);
    }

    return response.body.id;
  }

  private threadDtoToEntity(dto: ThreadDto): Thread {
    return {
      ...dto,
      loadingComments: false,
      comments: [],
      createCommentForm: {
        isSubmitting: false,
        text: '',
      },
    };
  }

  private commentDtoToEntity(dto: CommentWithRepliesDto): Comment {
    return {
      ...dto,
      isEditing: false,
    };
  }
}
