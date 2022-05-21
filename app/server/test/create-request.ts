export type CreateRequestOptions = Partial<{
  url: string;
  searchParams: URLSearchParams;
  form: FormData;
}>;

export const createRequest = (options?: CreateRequestOptions) => {
  let url = options?.url ?? 'http://test';

  if (options?.searchParams) {
    url += '?' + options.searchParams.toString();
  }

  return {
    url,
    async formData() {
      return options?.form;
    },
  } as Request;
};
