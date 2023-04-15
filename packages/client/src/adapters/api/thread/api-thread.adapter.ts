import { CreateOrEditThreadBody, RootCommentDto, ThreadDto } from '@shakala/shared';
import { injected } from 'brandi';

import { HttpError } from '~/adapters/http/http-error';
import { TOKENS } from '~/app/tokens';

import { ValidationErrors } from '../../../utils/validation-errors';
import { HttpPort } from '../../http/http.port';

import { GetThreadCommentsOptions, ThreadFormFields, ThreadPort } from './thread.port';

export class ApiThreadAdapter implements ThreadPort {
  constructor(protected readonly http: HttpPort) {}

  async getLastThreads(count: number): Promise<ThreadDto[]> {
    const response = await this.http.get<ThreadDto[]>('/thread', { search: { count } });
    return response.body;
  }

  async getThread(threadId: string): Promise<ThreadDto | undefined> {
    try {
      const response = await this.http.get<ThreadDto>(`/thread/${threadId}`);
      return response.body;
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
        return undefined;
      }

      throw error;
    }
  }

  async getThreadComments(threadId: string, options?: GetThreadCommentsOptions): Promise<RootCommentDto[]> {
    const response = await this.http.get<RootCommentDto[]>(`/thread/${threadId}/comments`, {
      search: options,
    });

    return response.body;
  }

  async createThread(fields: ThreadFormFields): Promise<string> {
    const response = await this.http.post<CreateOrEditThreadBody, string>(
      '/thread',
      this.threadFormFieldsToBody(fields),
      { onError: this.handleThreadFormError }
    );

    return response.body;
  }

  async editThread(threadId: string, fields: ThreadFormFields): Promise<void> {
    await this.http.put<CreateOrEditThreadBody, string>(
      `/thread/${threadId}`,
      this.threadFormFieldsToBody(fields),
      { onError: this.handleThreadFormError }
    );
  }

  private threadFormFieldsToBody = (fields: ThreadFormFields): CreateOrEditThreadBody => {
    const keywords = fields.keywords.split(' ').map((field) => field.trim());

    return {
      ...fields,
      keywords,
    };
  };

  private handleThreadFormError = (error: HttpError) => {
    // todo: test
    if (error.code === 'UserMustBeAuthorError') {
      throw new Error('UserMustBeAuthorError');
    }

    const validationError = ValidationErrors.from(error.response, (fieldName) => {
      if (/keywords\[\d+\]/.exec(fieldName)) {
        return 'keywords';
      }

      return fieldName;
    });

    throw validationError ?? error;
  };
}

injected(ApiThreadAdapter, TOKENS.http);
