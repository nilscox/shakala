import { useRouter } from 'next/router';

export const useSearchParams = () => {
  const { query } = useRouter();
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      value.forEach((value) => params.append(key, value));
    } else if (value) {
      params.set(key, value);
    }
  }

  return params;
};
