import { Module } from '@shakala/common';
import { Container } from 'brandi';

import { Database } from './database';
import { PERSISTENCE_TOKENS } from './tokens';

export class PersistenceModule extends Module {
  async init(container: Container) {
    this.expose(container, PERSISTENCE_TOKENS)
    await container.get(PERSISTENCE_TOKENS.database).init();
  }

  async close(container: Container) {
    await container.get(PERSISTENCE_TOKENS.database).close();
  }

  bypass() {
    const noDatabase = {
      init() {},
      close() {},
    } as Database

    this.bind(PERSISTENCE_TOKENS.database).toConstant(noDatabase);
  }
}

export const module = new PersistenceModule();

module.bind(PERSISTENCE_TOKENS.database).toInstance(Database).inContainerScope();
