import { container } from './container';
import { API_TOKENS } from './tokens';

Error.stackTraceLimit = Infinity;

main().catch(console.error);

async function main() {
  const application = container.get(API_TOKENS.server);

  await application.init();
  await application.listen();
}
