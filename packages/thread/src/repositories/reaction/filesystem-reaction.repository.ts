import { FilesystemPort } from '@shakala/common';

import { Reaction } from '../../entities/reaction.entity';

import { InMemoryReactionRepository } from './in-memory-reaction.repository';
import { ReactionRepository } from './reaction.repository';

export class FilesystemReactionRepository extends InMemoryReactionRepository implements ReactionRepository {
  entity = Reaction;

  constructor(private readonly filesystem: FilesystemPort) {
    super();
  }

  override async save(reaction: Reaction): Promise<void> {
    await super.save(reaction);
    await this.filesystem.writeJSONFile('reactions.json', this.all());
  }
}
