import { EmailValidationFailed, factories } from 'backend-domain';

import { InMemoryUserRepository } from '../../../adapters';

import { ValidateEmailAddressCommand, ValidateEmailAddressHandler } from './validate-email-address.command';

describe('ValidateEmailAddressCommand', () => {
  const userRepository = new InMemoryUserRepository();
  const handler = new ValidateEmailAddressHandler(userRepository);

  const create = factories();

  it("confirms the user's email address using its email validation token", async () => {
    const token = 'token';
    const user = create.user({ emailValidationToken: token });

    userRepository.add(user);

    await handler.handle(new ValidateEmailAddressCommand(user.id, token));

    expect(userRepository.get(user.id)).toHaveProperty('isEmailValidated', true);
  });

  it('throws an error when the tokens do not match', async () => {
    const user = create.user({ emailValidationToken: 'token' });

    userRepository.add(user);

    const error = await expect
      .rejects(handler.handle(new ValidateEmailAddressCommand(user.id, 'nope')))
      .with(EmailValidationFailed);

    expect(error).toHaveProperty('details.reason', 'InvalidToken');
  });

  it('throws an error when email was already validated', async () => {
    const user = create.user({ emailValidationToken: null });

    userRepository.add(user);

    const error = await expect
      .rejects(handler.handle(new ValidateEmailAddressCommand(user.id, '')))
      .with(EmailValidationFailed);

    expect(error).toHaveProperty('details.reason', 'EmailAlreadyValidated');
  });
});
