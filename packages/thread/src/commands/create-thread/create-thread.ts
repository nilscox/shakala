import {
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
import { Thread } from '../../entities/thread.entity';
import { ThreadRepository } from '../../repositories/thread/thread.repository';
import { THREAD_TOKENS } from '../../tokens';

export type CreateThreadCommand = {
  threadId: string;
  authorId: string;
  description: string;
  text: string;
  keywords: string[];
};

export const createThread = commandCreator<CreateThreadCommand>('createThread');

export class CreateThreadHandler implements CommandHandler<CreateThreadCommand> {
  constructor(
    private readonly dateAdapter: DatePort,
    private readonly publisher: EventPublisher,
    private readonly threadRepository: ThreadRepository
  ) {}

  async handle(command: CreateThreadCommand): Promise<void> {
    const { threadId, authorId, description, text, keywords } = command;

    const thread = new Thread({
      id: threadId,
      authorId,
      description,
      text: new Markdown(text),
      keywords,
      created: this.dateAdapter.now(),
      edited: this.dateAdapter.now(),
    });

    await this.threadRepository.save(thread);
    this.publisher.publish(new ThreadCreatedEvent(thread.id));
  }
}

injected(CreateThreadHandler, TOKENS.date, TOKENS.publisher, THREAD_TOKENS.repositories.threadRepository);
registerCommand(createThread, THREAD_TOKENS.commands.createThreadHandler);

export class ThreadCreatedEvent extends DomainEvent {
  constructor(threadId: string) {
    super('Thread', threadId);
  }
}
