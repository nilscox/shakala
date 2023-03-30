import { useRouter } from '~/app/router-context';

export const useHash = () => {
  return useRouter().hash;
};
