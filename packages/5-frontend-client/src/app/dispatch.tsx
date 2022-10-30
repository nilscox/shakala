'use client';

import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';

type DispatchProps = {
  action?: AnyAction;
  actions?: AnyAction[];
  children: React.ReactNode;
};

export const Dispatch = ({ action, actions, children }: DispatchProps) => {
  const dispatch = useDispatch();

  if (action) {
    dispatch(action);
  }

  if (actions) {
    actions.forEach(dispatch);
  }

  return <>{children}</>;
};
