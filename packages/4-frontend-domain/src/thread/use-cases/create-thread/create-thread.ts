import { createAction, query, QueryState } from '@nilscox/redux-query';
import { get } from 'shared';

import { requireAuthentication } from '../../../authentication';
import { handleAuthorizationError } from '../../../authorization/handle-authorization-error';
import { State, Thunk } from '../../../store.types';
import { FormErrors, FormField, ValidationError } from '../../../types';
import { SerializedError, serializeError } from '../../../utils/serialize-error';

export type ThreadForm = {
  description: string;
  text: string;
  keywords: string[];
};

type ThreadFormError = {
  type: 'ValidationError';
  fields: FormErrors<ThreadForm>;
};

const isThreadFormError = (error: unknown): error is ThreadFormError => {
  return get(error, 'type') === 'ValidationError';
};

const createThreadMutation = query<undefined, undefined, ThreadFormError | SerializedError>('createThread');

export const createThreadQueryReducer = createThreadMutation.reducer((query, action) => {
  const { error } = query;

  if (!isClearThreadFormFieldErrorAction(action) || !isThreadFormError(error)) {
    return query;
  }

  const { field } = action;
  const { [field]: _, ...fields } = error.fields;

  return {
    ...query,
    error: { ...error, fields },
  };
});

// actions

const actions = createThreadMutation.actions();

export const [clearThreadFormFieldError, isClearThreadFormFieldErrorAction] = createAction(
  'query/createThread/clearFieldError',
  (field: FormField<ThreadForm>) => ({ field }),
);

// selectors

const selectors = createThreadMutation.selectors((state: State) => state.threads.mutations.createThread);

export const selectIsCreatingThread = (state: State) => {
  return selectors.selectState(state, undefined) === QueryState.pending;
};

export const selectCreateThreadError = (state: State) => {
  return selectors.selectError(state, undefined);
};

export const selectCreateThreadFieldErrors = (state: State): FormErrors<ThreadForm> => {
  const error = selectCreateThreadError(state);

  if (!isThreadFormError(error)) {
    return {};
  }

  return error.fields;
};

// thunk

export const createNewThread = ({ description, text, keywords }: ThreadForm): Thunk => {
  return async (dispatch, _getState, { threadGateway, routerGateway, snackbarGateway, loggerGateway }) => {
    if (!dispatch(requireAuthentication())) {
      return;
    }

    try {
      dispatch(actions.setPending(undefined));

      const threadId = await threadGateway.createThread(description, text, keywords);

      routerGateway.navigate(`/discussions/${threadId}`);
      snackbarGateway.success('Votre fil de discussion a bien été créé.');

      dispatch(actions.setSuccess(undefined, undefined));
    } catch (error) {
      if (error instanceof ValidationError) {
        dispatch(
          actions.setError(undefined, {
            type: 'ValidationError',
            fields: error.fields.reduce(
              (obj, field) => ({ ...obj, [field.field.replace(/\[\d+\]$/, '')]: field.error }),
              {},
            ),
          }),
        );
      } else {
        dispatch(actions.setError(undefined, serializeError(error)));

        if (!dispatch(handleAuthorizationError(error, 'créer un nouveau fil de discussion'))) {
          loggerGateway.error(error);
          snackbarGateway.error("Une erreur s'est produite, votre fil de discussion n'a pas été créé.");
        }
      }
    }
  };
};
