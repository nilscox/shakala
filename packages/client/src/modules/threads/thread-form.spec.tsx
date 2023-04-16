import expect from '@nilscox/expect';
import { stub } from '@shakala/shared';
import { cleanup, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, it, vi } from 'vitest';

import { setupTest } from '~/utils/setup-test';
import { ValidationErrors } from '~/utils/validation-errors';

import { ThreadForm } from './thread-form';

vi.mock('~/elements/rich-text-editor');

describe('ThreadForm', () => {
  const { render } = setupTest();

  const fields = {
    description: () => screen.getByLabelText('Description'),
    keywords: () => screen.getByLabelText('Mots-clés'),
    text: () => screen.getByTestId('mock-rich-text-editor'),
    submit: (text: string) => screen.getByRole('button', { name: text }),
  };

  afterEach(() => {
    cleanup();
  });

  it('fills and submits the form', async () => {
    const onSubmit = stub();

    const user = render(<ThreadForm onSubmit={onSubmit} submitButtonText="submit" />);

    await user.type(fields.description(), 'description');
    await user.type(fields.keywords(), 'key words');
    await user.type(fields.text(), 'text');
    await user.click(fields.submit('submit'));

    expect(onSubmit).calledWith({
      description: 'description',
      keywords: 'key words',
      // todo: custom comparator
      text: expect.stringMatching(/text/),
    });
  });

  it.skip('displays the field errors', async () => {
    const onSubmit = stub();

    onSubmit.reject(
      new ValidationErrors({
        description: 'min',
        keywords: 'max',
        text: 'min',
      })
    );

    const user = render(<ThreadForm onSubmit={onSubmit} submitButtonText="submit" />);

    await user.type(fields.description(), 'description');
    await user.type(fields.keywords(), 'key words');
    await user.type(fields.text(), 'text');
    await user.click(fields.submit('submit'));

    await waitFor(() => {
      expect(fields.description()).toHaveErrorMessage('La description est trop courte');
      expect(fields.keywords()).toHaveErrorMessage('Un des mots-clés est trop long');
      expect(fields.text()).toHaveErrorMessage('Le texte est trop court');
    });
  });
});
