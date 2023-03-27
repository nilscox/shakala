import { Maybe, ThreadDto } from '@shakala/shared';

export type ThreadFormFields = {
  description: string;
  keywords: string;
  text: string;
};

export interface ThreadPort {
  getLastThreads(count: number): Promise<ThreadDto[]>;
  getThread(threadId: string): Promise<Maybe<ThreadDto>>;
  createThread(fields: ThreadFormFields): Promise<string>;
}
