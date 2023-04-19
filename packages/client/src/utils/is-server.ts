export const isServer = () => {
  return import.meta.env.SSR;
};

export const isClient = () => {
  return !isServer();
};
