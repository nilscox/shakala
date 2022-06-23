type Config = {
  apiUrl: string;
};

export const useConfig = (): Config => {
  return {
    apiUrl: String(process.env.API_URL),
  };
};
