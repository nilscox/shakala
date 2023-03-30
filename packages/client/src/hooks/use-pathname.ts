import { useRouter } from '~/app/router-context';

export const usePathname = () => {
  return useRouter().pathname;
};
