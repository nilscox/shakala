export const pick = <T, K extends keyof T>(obj: T, ...keys: K[]): { [Key in K]: T[Key] } => {
  const result = {} as { [Key in K]: T[Key] };

  for (const key of keys) {
    result[key] = obj[key];
  }

  return result;
};
