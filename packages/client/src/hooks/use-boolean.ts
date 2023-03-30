import { useCallback, useState } from 'react';

export function useBoolean(initialValue: boolean) {
  const [value, setValue] = useState(initialValue);

  return [
    value,
    useCallback(() => setValue(true), [setValue]),
    useCallback(() => setValue(false), [setValue]),
  ] as const;
}
