import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';

import { ThreadForm } from './thread-form';

type UserEvent = ReturnType<typeof userEvent.setup>;

describe('ThreadForm', () => {
  const props: ComponentProps<typeof ThreadForm> = {
    errors: {},
    onSubmit: vi.fn(),
    onChange: vi.fn(),
  };

  const fields = {
    description: () => screen.getByLabelText('Description'),
    keywords: () => screen.getByLabelText('Mots-clés'),
    text: () => screen.getByLabelText('Texte'),
    submit: () => screen.getByRole('button', { name: 'Créer' }),
  };

  it('fills and submits the form', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<ThreadForm {...props} onSubmit={onSubmit} />);

    await user.type(fields.description(), 'description');
    await user.type(fields.keywords(), 'key words');
    await user.type(fields.text(), 'text');
    await user.click(fields.submit());

    expect(onSubmit).toHaveBeenCalledWith({
      description: 'description',
      keywords: ['key', 'words'],
      text: 'text',
    });
  });

  it('normalizes the fields (trim whitespaces)', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<ThreadForm {...props} onSubmit={onSubmit} />);

    await user.type(fields.description(), ' description ');
    await user.type(fields.keywords(), ' key   words ');
    await user.type(fields.text(), ' text ');
    await user.click(fields.submit());

    expect(onSubmit).toHaveBeenCalledWith({
      description: 'description',
      keywords: ['key', 'words'],
      text: 'text',
    });
  });

  describe('field errors', () => {
    let user: UserEvent;
    const clearFieldError = vi.fn();

    beforeEach(() => {
      user = userEvent.setup();

      render(
        <ThreadForm
          {...props}
          errors={{
            description: 'min',
            keywords: 'max',
            text: 'min',
          }}
          onChange={clearFieldError}
        />,
      );
    });

    it('displays the field errors', () => {
      expect(fields.description()).toHaveErrorMessage('La description est trop courte');
      expect(fields.keywords()).toHaveErrorMessage('Un des mots-clés est trop long');
      expect(fields.text()).toHaveErrorMessage('Le texte est trop court');
    });

    it('clears the field errors', async () => {
      await user.type(fields.description(), 'a');
      expect(clearFieldError).toHaveBeenCalledWith('description');

      await user.type(fields.keywords(), 'a');
      expect(clearFieldError).toHaveBeenCalledWith('keywords');

      await user.type(fields.text(), 'a');
      expect(clearFieldError).toHaveBeenCalledWith('text');
    });
  });
});
