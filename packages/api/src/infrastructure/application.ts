import { CommonModule, Module, ModuleConfig, TOKENS } from '@shakala/common';
import { EmailModule } from '@shakala/email';
import { ThreadModule } from '@shakala/thread';
import { UserModule } from '@shakala/user';

import { ApiModule } from '../api.module';
import { container } from '../container';

type Modules = {
  common: CommonModule;
  user: UserModule;
  email: EmailModule;
  thread: ThreadModule;
  api: ApiModule;
};

export type ApplicationConfig = {
  [Key in keyof Modules]: ModuleConfig<Modules[Key]>;
};

export class Application {
  private modules: Modules = {
    common: new CommonModule(container),
    user: new UserModule(container),
    email: new EmailModule(container),
    thread: new ThreadModule(container),
    api: new ApiModule(container),
  };

  async init(config: ApplicationConfig) {
    container.bind(TOKENS.container).toConstant(container);

    for (const [key, module] of Object.entries<Module>(this.modules)) {
      module.configure(config[key as keyof Modules]);
    }

    for (const module of Object.values<Module>(this.modules)) {
      await module.init?.();
    }
  }

  async close() {}
}
