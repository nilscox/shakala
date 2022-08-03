import { DateService, Markdown, Thread, ThreadAuthor, Timestamp } from 'backend-domain';

import { Command, CommandHandler } from '../cqs/command-handler';
import { GeneratorService } from '../interfaces/generator.service';
import { ThreadRepository } from '../interfaces/thread.repository';
import { UserRepository } from '../interfaces/user.repository';

export class CreateThreadCommand implements Command {
  constructor(readonly authorId: string, readonly text: string) {}
}

export class CreateThreadHandler implements CommandHandler<CreateThreadCommand> {
  constructor(
    private readonly generatorService: GeneratorService,
    private readonly dateService: DateService,
    private readonly userRepository: UserRepository,
    private readonly threadRepository: ThreadRepository,
  ) {}

  async handle({ authorId, text }: CreateThreadCommand) {
    const author = await this.userRepository.findByIdOrFail(authorId);

    const thread = new Thread({
      id: await this.generatorService.generateId(),
      author: new ThreadAuthor(author),
      text: new Markdown(text),
      created: Timestamp.now(this.dateService),
    });

    await this.threadRepository.save(thread);
  }
}
