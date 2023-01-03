import { LoggerGateway } from '../gateways';
import { createStubFunction } from '../utils/create-stub-function';

export class StubLoggerGateway implements LoggerGateway {
  error = createStubFunction<LoggerGateway['error']>();
}
