import { Server } from './server';

const main = async () => {
  const server = new Server();

  await server.init();
  await server.start();

  const close = () => server.close();

  process.on('SIGINT', close);
  process.on('SIGTERM', close);
};

main().catch(console.error);
