import { AuthorizationErrorReason } from 'shared';

import { selectIsAuthenticationModalOpen, setUser } from '../../../authentication';
import { createAuthUser, TestStore } from '../../../test';
import { AuthorizationError, ValidationError } from '../../../types';

import {
  clearThreadFormFieldError,
  createNewThread,
  selectCreateThreadError,
  selectCreateThreadFieldErrors,
  selectIsCreatingThread,
} from './create-thread';

describe('createThread', () => {
  const store = new TestStore();

  const threadId = 'threadId';

  beforeEach(() => {
    store.dispatch(setUser(createAuthUser()));
    store.threadGateway.createThread.mockResolvedValue(threadId);
  });

  const description = 'description';
  const text = 'text';
  const keywords = ['key', 'words'];

  const execute = async () => {
    await store.dispatch(createNewThread({ description, text, keywords }));
  };

  it('creates a new thread', async () => {
    const promise = execute();

    expect(store.select(selectIsCreatingThread)).toBe(true);
    await promise;
    expect(store.select(selectIsCreatingThread)).toBe(false);

    expect(store.threadGateway.createThread).toHaveBeenCalledWith(description, text, keywords);
  });

  it('requires user authentication', async () => {
    store.user = undefined;

    await execute();

    expect(store.select(selectIsAuthenticationModalOpen)).toBe(true);
  });

  it('redirects to the new thread page', async () => {
    await execute();

    expect(store.routerGateway.pathname).toEqual(`/discussions/${threadId}`);
  });

  it('shows a snack when the creation succeeded', async () => {
    await execute();

    expect(store.snackbarGateway.success).toHaveBeenCalledWith('Votre fil de discussion a bien été créé.');
  });

  describe('validation error handling', () => {
    const error = new ValidationError([
      { field: 'description', error: 'min', value: 'a' },
      { field: 'keywords[1]', error: 'min', value: 'a' },
    ]);

    beforeEach(() => {
      store.threadGateway.createThread.mockRejectedValue(error);
    });

    it('stores the error', async () => {
      await execute();

      expect(store.select(selectIsCreatingThread)).toBe(false);
      expect(store.select(selectCreateThreadFieldErrors)).toEqual({
        description: 'min',
        keywords: 'min',
      });
    });

    it('clears a single field error', async () => {
      await execute();

      store.dispatch(clearThreadFormFieldError('keywords'));

      expect(store.select(selectCreateThreadError)).not.toHaveProperty('fields.keywords');
    });
  });

  describe('authorization error handling', () => {
    it('shows a snack when the user is not authorized to create a thread', async () => {
      store.threadGateway.createThread.mockRejectedValue(
        new AuthorizationError(AuthorizationErrorReason.emailValidationRequired),
      );

      await execute();

      expect(store.snackbarGateway.error).toHaveBeenCalledWith(
        expect.stringMatching(/créer un nouveau fil de discussion.$/),
      );
    });
  });

  describe('fallback error handling', () => {
    const error = new Error('nope.');

    beforeEach(() => {
      store.threadGateway.createThread.mockRejectedValue(error);
    });

    it('stores the error', async () => {
      await execute();

      expect(store.select(selectIsCreatingThread)).toBe(false);
      expect(store.select(selectCreateThreadError)).toHaveProperty('message', error.message);
    });

    it('logs the error', async () => {
      await execute();

      expect(store.loggerGateway.error).toHaveBeenCalledWith(error);
    });

    it('shows a snack with a fallback message', async () => {
      await execute();

      expect(store.snackbarGateway.error).toHaveBeenCalledWith(
        "Une erreur s'est produite, votre fil de discussion n'a pas été créé.",
      );
    });
  });
});
