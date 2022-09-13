import { Authorize, Authorizer, Command, CommandHandler, ExecutionContext } from 'backend-application';
import { factories } from 'backend-domain';

import { RealCommandBus } from './command-bus';

describe('RealCommandBus', () => {
  class TestCommand implements Command {}
  const ctx = ExecutionContext.unauthenticated;

  it('executes a command', async () => {
    const handle = vi.fn();

    class TestHandler implements CommandHandler<TestCommand> {
      handle = handle;
    }

    const commandBus = new RealCommandBus();
    const command = new TestCommand();

    commandBus.register(TestCommand, new TestHandler());
    await commandBus.init();

    await commandBus.execute(command, ctx);

    expect(handle).toHaveBeenCalledWith(command, ctx);
  });

  it('initializes all registered commands', async () => {
    const init = vi.fn();

    class TestHandler implements CommandHandler<TestCommand> {
      init = init;
      handle = vi.fn();
    }

    const commandBus = new RealCommandBus();

    commandBus.register(TestCommand, new TestHandler());

    await commandBus.init();

    expect(init).toHaveBeenCalled();
  });

  it('invokes the authorizers with the execution context', async () => {
    const user = factories().user();
    const authorize = vi.fn();

    class TestAuthorizer implements Authorizer {
      authorize = authorize;
    }

    @Authorize(TestAuthorizer)
    class TestHandler implements CommandHandler<TestCommand> {
      handle = vi.fn();
    }

    const commandBus = new RealCommandBus();
    const ctx = new ExecutionContext(user);

    commandBus.register(TestCommand, new TestHandler());
    await commandBus.init();

    await commandBus.execute(new TestCommand(), ctx);

    expect(authorize).toHaveBeenCalledWith(ctx);
  });

  it('throws when the command is not authorized', async () => {
    const error = new Error('nope');

    class TestAuthorizer implements Authorizer {
      authorize(): void {
        throw error;
      }
    }

    @Authorize(TestAuthorizer)
    class TestHandler implements CommandHandler<TestCommand> {
      handle = vi.fn();
    }

    const commandBus = new RealCommandBus();

    commandBus.register(TestCommand, new TestHandler());
    await commandBus.init();

    await expect(commandBus.execute(new TestCommand(), ctx)).rejects.toThrow(error);
  });

  it('throws when no handler is found for a given command', async () => {
    const commandBus = new RealCommandBus();

    await expect(commandBus.execute(new TestCommand(), ctx)).rejects.toThrow(
      'cannot find handler for TestCommand',
    );
  });
});
