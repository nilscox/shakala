import expect from '@nilscox/expect';
import { cleanup, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, it } from 'vitest';

import { setupTest } from '~/utils/setup-test';
import { ValidationErrors } from '~/utils/validation-errors';

import { ThreadForm } from './thread-form';

describe('ThreadForm', () => {
  const { render, adapters } = setupTest();

  const fields = {
    description: () => screen.getByLabelText('Description'),
    keywords: () => screen.getByLabelText('Mots-clés'),
    text: () => screen.getByLabelText('Texte'),
    submit: () => screen.getByRole('button', { name: 'Créer' }),
  };

  afterEach(() => {
    cleanup();
  });

  it('fills and submits the form', async () => {
    adapters.thread.createThread.resolve('threadId');

    const user = render(<ThreadForm />);

    await user.type(fields.description(), 'description');
    await user.type(fields.keywords(), 'key words');
    await user.type(fields.text(), 'text');
    await user.click(fields.submit());

    await waitFor(() => {
      expect(adapters.router.pathname).toEqual('/discussions/threadId');
    });
  });

  it('displays the field errors', async () => {
    adapters.thread.createThread.reject(
      new ValidationErrors({
        description: 'min',
        keywords: 'max',
        text: 'min',
      })
    );

    const user = render(<ThreadForm />);

    await user.type(fields.description(), 'description');
    await user.type(fields.keywords(), 'key words');
    await user.type(fields.text(), 'text');
    await user.click(fields.submit());

    await waitFor(() => {
      expect(fields.description()).toHaveErrorMessage('La description est trop courte');
      expect(fields.keywords()).toHaveErrorMessage('Un des mots-clés est trop long');
      expect(fields.text()).toHaveErrorMessage('Le texte est trop court');
    });
  });
});
