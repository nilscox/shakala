import { EnumType } from '../types/enum-type';

import { contains } from './contains';

export const isEnumValue = <T extends string>(enumType: EnumType<T>) => {
  return (value?: string): value is T => {
    return contains(Object.values(enumType), value);
  };
};
