import { Container, DependencyModule, Token } from 'brandi';

import { TOKENS } from '../tokens';

export class Module extends DependencyModule {
  init?(container: Container): void | Promise<void>;
  close?(container: Container): void | Promise<void>;

  protected expose(container: Container, tokens: Record<string, Token>) {
    const logger = container.get(TOKENS.logger);

    logger.tag = this.constructor.name;

    Object.values(tokens).forEach((token) => {
      // logger.verbose(`exposing ${token.__d}`);
      container.use(token).from(this);
    });
  }

  snapshot?: ReturnType<Exclude<typeof this.vault.copy, undefined>>;

  capture(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.snapshot = this.vault.copy!();
  }

  restore(): void {
    if (this.snapshot) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.vault = this.snapshot.copy!();
    } else {
      console.error(
        "Error: It looks like a trying to restore a non-captured container state. Did you forget to call 'capture()' method?"
      );
    }
  }
}
