import { Server } from './server';

const main = async () => {
  await new Server().start();
};

main().catch(console.error);
