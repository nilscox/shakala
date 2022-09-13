import { Author, DateService, GeneratorService, Markdown, Thread, Timestamp } from 'backend-domain';

import { Authorize, HasWriteAccess, IsAuthenticated } from '../../authorization';
import { Command, CommandHandler } from '../../cqs/command-handler';
import { ThreadRepository } from '../../interfaces/repositories';
import { AuthenticatedExecutionContext } from '../../utils/execution-context';

export class CreateThreadCommand implements Command {
  constructor(readonly description: string, readonly text: string, readonly keywords: string[]) {}
}

@Authorize(IsAuthenticated, HasWriteAccess)
export class CreateThreadHandler implements CommandHandler<CreateThreadCommand, string> {
  constructor(
    private readonly generatorService: GeneratorService,
    private readonly dateService: DateService,
    private readonly threadRepository: ThreadRepository,
  ) {}

  async handle(command: CreateThreadCommand, ctx: AuthenticatedExecutionContext) {
    const { description, text, keywords } = command;
    const { user: author } = ctx;

    const thread = new Thread({
      id: await this.generatorService.generateId(),
      author: new Author(author),
      description,
      text: new Markdown(text),
      keywords,
      created: Timestamp.now(this.dateService),
    });

    await this.threadRepository.save(thread);

    return thread.id;
  }
}
