import { StubDateService } from 'backend-domain';
import { MockedObject } from 'vitest';

import { ConsoleLoggerService } from './console-logger.service';

describe('ConsoleLoggerService', () => {
  const dateService = new StubDateService();

  const mockConsole = {
    log: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  } as MockedObject<typeof console>;

  const service = new ConsoleLoggerService(dateService, mockConsole);

  it('logs a formatted message to the console', () => {
    dateService.setNow(new Date(2022, 7, 1, 12, 34, 56));

    service.log('Go, go, go!');

    expect(mockConsole.log).toHaveBeenCalledWith('[2022-08-01 12:34:56] [log]', 'Go, go, go!');
  });

  it('logs a message with level info', () => {
    const service = new ConsoleLoggerService(dateService, mockConsole);

    service.info('Fire in the hole!');

    const [call] = mockConsole.info.mock.calls;

    expect(call?.[0]).toMatch(/ \[info\]$/);
    expect(call?.[1]).toEqual('Fire in the hole!');
  });

  it('logs a message with level error', () => {
    const service = new ConsoleLoggerService(dateService, mockConsole);

    service.error(new Error('Enemy spotted.'));

    const [call] = mockConsole.error.mock.calls;

    expect(call?.[0]).toMatch(/ \[error\]$/);
    expect(call?.[1]).toMatch(/^Error: Enemy spotted.\n {4}at/);
  });
});
