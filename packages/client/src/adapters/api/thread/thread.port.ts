import { Maybe, ThreadDto } from '@shakala/shared';

import { ApiAdapter } from '../api-adapter';

export type ThreadFormFields = {
  description: string;
  keywords: string;
  text: string;
};

export interface ThreadPort extends ApiAdapter {
  getLastThreads(count: number): Promise<ThreadDto[]>;
  getThread(threadId: string): Promise<Maybe<ThreadDto>>;
  createThread(fields: ThreadFormFields): Promise<string>;
}
