import { AppState } from '@shakala/frontend-domain';
// eslint-disable-next-line no-restricted-imports
import { useSelector } from 'react-redux';

export const useAppSelector = <Params extends unknown[], Result>(
  selector: (state: AppState, ...params: Params) => Result,
  ...params: Params
) => {
  return useSelector<AppState, Result>((state) => selector(state, ...params));
};
