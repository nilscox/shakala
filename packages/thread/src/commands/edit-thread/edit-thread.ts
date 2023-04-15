import {
  BaseError,
  commandCreator,
  CommandHandler,
  DatePort,
  DomainEvent,
  EventPublisher,
  registerCommand,
  TOKENS,
} from '@shakala/common';
import { injected } from 'brandi';

import { Markdown } from '../../entities/markdown.value-object';
import { ThreadRepository } from '../../repositories/thread/thread.repository';
import { THREAD_TOKENS } from '../../tokens';

export type EditThreadCommand = {
  threadId: string;
  authorId: string;
  description: string;
  text: string;
  keywords: string[];
};

export const editThread = commandCreator<EditThreadCommand>('editThread');

export class EditThreadHandler implements CommandHandler<EditThreadCommand> {
  constructor(
    private readonly dateAdapter: DatePort,
    private readonly publisher: EventPublisher,
    private readonly threadRepository: ThreadRepository
  ) {}

  async handle(command: EditThreadCommand): Promise<void> {
    const { threadId, authorId, description, text, keywords } = command;

    const thread = await this.threadRepository.findByIdOrFail(threadId);

    if (authorId !== thread.authorId) {
      throw new UserMustBeAuthorError(authorId, threadId);
    }

    thread.description = description;
    thread.keywords = keywords;
    thread.text = new Markdown(text);
    thread.edited = this.dateAdapter.now();

    await this.threadRepository.save(thread);
    this.publisher.publish(new ThreadEditedEvent(thread.id));
  }
}

injected(EditThreadHandler, TOKENS.date, TOKENS.publisher, THREAD_TOKENS.repositories.threadRepository);
registerCommand(editThread, THREAD_TOKENS.commands.editThreadHandler);

export class UserMustBeAuthorError extends BaseError<{ userId: string; threadId: string }> {
  status = 403;

  constructor(userId: string, threadId: string) {
    super('user must be the author of the thread', { userId, threadId });
  }
}

export class ThreadEditedEvent extends DomainEvent {
  constructor(threadId: string) {
    super('Thread', threadId);
  }
}
