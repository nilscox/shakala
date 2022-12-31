import { AppStore } from '@shakala/frontend-domain';
// eslint-disable-next-line no-restricted-imports
import { useDispatch } from 'react-redux';

export const useAppDispatch = () => {
  return useDispatch<AppStore['dispatch']>();
};
