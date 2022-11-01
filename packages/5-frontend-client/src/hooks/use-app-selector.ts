import { State } from 'frontend-domain';
import { useSelector } from 'react-redux';

export const useAppSelector = <Params extends unknown[], Result>(
  selector: (state: State, ...params: Params) => Result,
  ...params: Params
) => {
  return useSelector<State, Result>((state) => selector(state, ...params));
};
