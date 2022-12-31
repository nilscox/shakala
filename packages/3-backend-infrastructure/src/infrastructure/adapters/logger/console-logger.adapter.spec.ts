import { StubDateAdapter } from '@shakala/backend-domain';
import { mockObject } from '@shakala/shared/test';

import { ConsoleLoggerAdapter } from './console-logger.adapter';

describe('ConsoleLoggerAdapter', () => {
  const dateAdapter = new StubDateAdapter();
  const mockConsole = mockObject(console);

  const logger = new ConsoleLoggerAdapter(dateAdapter, mockConsole);

  it('logs a formatted message to the console', () => {
    dateAdapter.setNow(new Date(2022, 7, 1, 12, 34, 56));

    logger.log('Go, go, go!');

    expect(mockConsole.log).toHaveBeenCalledWith('[2022-08-01 12:34:56] [log]', 'Go, go, go!');
  });

  it('logs a message with level info', () => {
    logger.info('Fire in the hole!');

    const { args } = mockConsole.info.getCall(0);

    expect(args[0]).toMatch(/ \[info\]$/);
    expect(args[1]).toEqual('Fire in the hole!');
  });

  it('logs a message with level error', () => {
    logger.error(new Error('Enemy spotted.'));

    const { args } = mockConsole.error.getCall(0);

    expect(args?.[0]).toMatch(/ \[error\]$/);
    expect(args?.[1]).toMatch(/^Error: Enemy spotted.\n {4}at/);
  });
});
