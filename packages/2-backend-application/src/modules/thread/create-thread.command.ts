import { GeneratorService, DateService, Markdown, Thread, Author, Timestamp } from 'backend-domain';

import { Command, CommandHandler } from '../../cqs/command-handler';
import { ThreadRepository, UserRepository } from '../../interfaces/repositories';

export class CreateThreadCommand implements Command {
  constructor(
    readonly authorId: string,
    readonly description: string,
    readonly text: string,
    readonly keywords: string[],
  ) {}
}

export class CreateThreadHandler implements CommandHandler<CreateThreadCommand, string> {
  constructor(
    private readonly generatorService: GeneratorService,
    private readonly dateService: DateService,
    private readonly userRepository: UserRepository,
    private readonly threadRepository: ThreadRepository,
  ) {}

  async handle({ authorId, description, text, keywords }: CreateThreadCommand) {
    const author = await this.userRepository.findByIdOrFail(authorId);

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
