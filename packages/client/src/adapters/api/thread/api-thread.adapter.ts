import { CreateThreadBody, Maybe, ThreadDto } from '@shakala/shared';

import { ValidationErrors } from '../../../utils/validation-errors';
import { ApiAdapter } from '../api-adapter';

import { ThreadFormFields, ThreadPort } from './thread.port';

export class ApiThreadAdapter extends ApiAdapter implements ThreadPort {
  async getLastThreads(count: number): Promise<ThreadDto[]> {
    const response = await this.http.get<ThreadDto[]>('/thread', { search: { count } });
    return response.body;
  }

  async getThread(threadId: string): Promise<Maybe<ThreadDto>> {
    const response = await this.http.get<ThreadDto>(`/thread/${threadId}`);
    return response.body;
  }

  async createThread(fields: ThreadFormFields): Promise<string> {
    const keywords = fields.keywords.split(' ').map((field) => field.trim());

    const response = await this.http.post<CreateThreadBody, string>(
      '/thread',
      { ...fields, keywords },
      {
        onError(error) {
          const validationError = ValidationErrors.from(error.response, (fieldName) => {
            if (/keywords\[\d+\]/.exec(fieldName)) {
              return 'keywords';
            }

            return fieldName;
          });

          throw validationError ?? error;
        },
      }
    );

    return response.body;
  }
}
