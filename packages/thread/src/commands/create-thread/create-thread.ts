import { commandCreator, CommandHandler, DatePort, DomainEvent, EventPublisher } from '@shakala/common';

import { Markdown } from '../../entities/markdown.value-object';
import { Thread } from '../../entities/thread.entity';
import { ThreadRepository } from '../../repositories/thread/thread.repository';

export type CreateThreadCommand = {
  threadId: string;
  authorId: string;
  description: string;
  text: string;
  keywords: string[];
};

const symbol = Symbol('CreateThreadCommand');
export const createComment = commandCreator<CreateThreadCommand>(symbol);

export class CreateThreadHandler implements CommandHandler<CreateThreadCommand> {
  symbol = symbol;

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
    });

    await this.threadRepository.save(thread);
    this.publisher.publish(new ThreadCreatedEvent(thread.id));
  }
}

export class ThreadCreatedEvent extends DomainEvent {
  constructor(threadId: string) {
    super('Thread', threadId);
  }
}
