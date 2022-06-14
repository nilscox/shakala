import { Dispatch } from 'frontend-domain';
import { useDispatch as useReduxDispatch } from 'react-redux';

export const useDispatch = () => {
  return useReduxDispatch<Dispatch>();
};
