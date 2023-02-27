import { container } from './container';
import { API_TOKENS } from './tokens';

Error.stackTraceLimit = Infinity;

const { HOST: host = 'localhost', PORT: port = '4242' } = process.env;

startServer().catch(console.error);

async function startServer() {
  const server = container.get(API_TOKENS.server);

  await server.listen(host, Number(port));
  console.log(`Server listening on ${host}:${port}`);
}
