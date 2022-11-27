import { useRouter } from 'next/router';

export const useParams = () => {
  return useRouter().query;
};
