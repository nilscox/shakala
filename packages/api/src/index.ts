import { StubGeneratorAdapter } from '@shakala/common';
import { InMemoryUserRepository } from '@shakala/user';

import { BcryptAdapter } from './infrastructure/bcrypt.adapter';
import { EmitterEventPublisher } from './infrastructure/emitter-event-publisher';
import { RealCommandBus } from './infrastructure/real-command-bus';
import { Server } from './infrastructure/server';

const { HOST: host = 'localhost', PORT: port = '4242' } = process.env;

startServer().catch(console.error);

async function startServer() {
  const generator = new StubGeneratorAdapter();
  const crypto = new BcryptAdapter();
  const publisher = new EmitterEventPublisher();
  const userRepository = new InMemoryUserRepository();

  const commandBus = new RealCommandBus({ crypto, publisher, userRepository });

  const server = new Server(generator, commandBus);

  await server.listen(host, Number(port));
  console.log(`Server listening on ${host}:${port}`);
}
