import { FilesystemPort, TOKENS } from '@shakala/common';
import { injected } from 'brandi';

import { Reaction } from '../../entities/reaction.entity';

import { InMemoryReactionRepository } from './in-memory-reaction.repository';
import { ReactionRepository } from './reaction.repository';

export class FilesystemReactionRepository extends InMemoryReactionRepository implements ReactionRepository {
  entity = Reaction;

  constructor(private readonly filesystem: FilesystemPort) {
    super();
  }

  override dump = () => this.filesystem.dumpRepository(this);
}

injected(FilesystemReactionRepository, TOKENS.filesystem);
