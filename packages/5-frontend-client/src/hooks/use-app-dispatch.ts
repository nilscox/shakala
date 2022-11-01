import { Dispatch } from 'frontend-domain';
import { useDispatch } from 'react-redux';

export const useAppDispatch = () => {
  return useDispatch<Dispatch>();
};
