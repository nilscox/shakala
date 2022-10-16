import { Author, DatePort, GeneratorPort, Markdown, Thread, Timestamp } from 'backend-domain';

import { Authorize, HasWriteAccess, IsAuthenticated } from '../../../authorization';
import { Command, CommandHandler, IEventBus } from '../../../cqs';
import { ThreadRepository } from '../../../interfaces';
import { AuthenticatedExecutionContext, EventPublisher } from '../../../utils';

export class CreateThreadCommand implements Command {
  constructor(readonly description: string, readonly text: string, readonly keywords: string[]) {}
}

@Authorize(IsAuthenticated, HasWriteAccess)
export class CreateThreadHandler implements CommandHandler<CreateThreadCommand, string> {
  constructor(
    private readonly eventBus: IEventBus,
    private readonly generator: GeneratorPort,
    private readonly dateAdapter: DatePort,
    private readonly threadRepository: ThreadRepository,
  ) {}

  async handle(command: CreateThreadCommand, ctx: AuthenticatedExecutionContext) {
    const { description, text, keywords } = command;
    const { user: author } = ctx;

    const thread = Thread.create({
      id: await this.generator.generateId(),
      author: new Author(author),
      description,
      text: new Markdown(text),
      keywords,
      created: Timestamp.now(this.dateAdapter),
    });

    const publisher = new EventPublisher(ctx, thread);

    await this.threadRepository.save(thread);
    publisher.publish(this.eventBus);

    return thread.id;
  }
}
