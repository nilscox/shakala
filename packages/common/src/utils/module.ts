import { ClassType } from '@shakala/shared';
import { Container, DependencyModule, Token } from 'brandi';

import { LoggerPort } from '../adapters/logger/logger.port';
import { TOKENS } from '../tokens';

export type ModuleConfig<M extends Module> = M extends { configure(config: infer Config): void }
  ? Config
  : never;

export interface Module {
  configure(config?: unknown): void;
  init?(): Promise<void>;
}

export abstract class Module extends DependencyModule {
  private name: string;
  protected _logger?: LoggerPort;

  constructor(protected readonly container: Container) {
    super();
    this.name = new.target.name;
  }

  get logger() {
    if (!this._logger) {
      this._logger = this.container.get(TOKENS.logger);
      this._logger.tag = this.name;
    }

    return this._logger;
  }

  get commandBus() {
    return this.container.get(TOKENS.commandBus);
  }

  get queryBus() {
    return this.container.get(TOKENS.queryBus);
  }

  protected bindToken<Cls>(token: Token<Cls>, Instance: ClassType<Cls>, expose = true) {
    const tokenStr = token.__s.toString().replace(/^Symbol\((.*)\)$/, '$1');

    this.logger.verbose('binding', tokenStr, '->', Instance.name);
    this.bind(token).toInstance(Instance).inContainerScope();

    if (expose) {
      this.container.use(token).from(this);
    }
  }
}
