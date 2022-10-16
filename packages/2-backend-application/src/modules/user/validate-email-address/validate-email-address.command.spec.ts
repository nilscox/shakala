import { EmailAddressValidatedEvent, EmailValidationFailed, factories, User } from 'backend-domain';

import { InMemoryUserRepository, StubEventBus } from '../../../adapters';
import { ExecutionContext } from '../../../utils';

import { ValidateEmailAddressCommand, ValidateEmailAddressHandler } from './validate-email-address.command';

describe('ValidateEmailAddressCommand', () => {
  const eventBus = new StubEventBus();
  const userRepository = new InMemoryUserRepository();
  const handler = new ValidateEmailAddressHandler(eventBus, userRepository);

  const create = factories();

  const execute = async (user: User, token: string) => {
    await handler.handle(new ValidateEmailAddressCommand(user.id, token), ExecutionContext.as(user));
  };

  it("confirms the user's email address using its email validation token", async () => {
    const token = 'token';
    const user = create.user({ emailValidationToken: token });

    userRepository.add(user);

    await execute(user, token);

    expect(userRepository.get(user.id)).toHaveProperty('isEmailValidated', true);
  });

  it('emits an EmailAddressValidatedEvent', async () => {
    const token = 'token';
    const user = create.user({ emailValidationToken: token });

    userRepository.add(user);

    await execute(user, token);

    expect(eventBus).toHaveEmitted(new EmailAddressValidatedEvent(user.id));
  });

  it('throws an error when the tokens do not match', async () => {
    const user = create.user({ emailValidationToken: 'token' });

    userRepository.add(user);

    const error = await expect.rejects(execute(user, 'nope')).with(EmailValidationFailed);

    expect(error).toHaveProperty('details.reason', 'InvalidToken');
  });

  it('throws an error when email was already validated', async () => {
    const user = create.user({ emailValidationToken: null });

    userRepository.add(user);

    const error = await expect.rejects(execute(user, '')).with(EmailValidationFailed);

    expect(error).toHaveProperty('details.reason', 'EmailAlreadyValidated');
  });
});
