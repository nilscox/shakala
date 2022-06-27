import { Dispatch } from 'frontend-domain';
// eslint-disable-next-line no-restricted-imports
import { useDispatch as useReduxDispatch } from 'react-redux';

export const useDispatch = () => {
  return useReduxDispatch<Dispatch>();
};
