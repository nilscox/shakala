import { createAction, query } from '@nilscox/redux-query';

import { State, Thunk } from '../../../store.types';
import { AuthUser } from '../../../types';

const fetchAuthenticatedUserQuery = query<undefined, AuthUser | undefined>('fetchUser');

export const fetchAuthenticatedUserReducer = fetchAuthenticatedUserQuery.reducer((query, action) => {
  if (!query.result) {
    return query;
  }

  if (isUpdateUserAction(action)) {
    return {
      ...query,
      result: { ...query.result, ...action.changes },
    };
  }

  return query;
});

const actions = fetchAuthenticatedUserQuery.actions();

export const setUser = (user: AuthUser) => actions.setSuccess(undefined, user);
export const unsetUser = () => actions.setSuccess(undefined, undefined);

const [updateUser, isUpdateUserAction] = createAction('user/update', (changes: Partial<AuthUser>) => ({
  changes,
}));

export { updateUser };

const selectors = fetchAuthenticatedUserQuery.selectors<State>(
  (state) => state.user.queries.fetchAuthenticatedUser,
);

export const selectAuthenticatedUser = (state: State) => selectors.selectResult(state, undefined);

export const fetchAuthenticatedUser = (): Thunk<Promise<void>> => {
  return async (dispatch, getState, { authenticationGateway }) => {
    try {
      dispatch(actions.setPending(undefined));

      const user = await authenticationGateway.fetchUser();

      if (user) {
        dispatch(actions.setSuccess(undefined, user));
      }
    } catch (error) {
      dispatch(actions.setError(undefined, error));
    }
  };
};
