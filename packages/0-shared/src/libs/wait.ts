export const wait = (timeout: number) => {
  return new Promise((r) => setTimeout(r, timeout));
};
