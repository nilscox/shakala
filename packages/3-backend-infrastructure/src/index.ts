import { Server } from './server';

const main = async () => {
  const server = new Server();

  await server.init();
  await server.start();
};

main().catch(console.error);
