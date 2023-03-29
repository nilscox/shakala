import { useState } from 'react';

export function useBoolean(initialValue: boolean) {
  const [value, setValue] = useState(initialValue);

  return [value, () => setValue(true), () => setValue(false)] as const;
}
