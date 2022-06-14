import { Selector, State } from 'frontend-domain';
import { useSelector as useReduxSelector } from 'react-redux';

export const useSelector = <Params extends unknown[], Result>(
  selector: Selector<Params, Result>,
  ...params: Params
) => {
  return useReduxSelector<State, Result>((state) => selector(state, ...params));
};
