import { EnumType } from '@shakala/shared';

type NumberOptions = Partial<Record<'min' | 'max' | 'step', number>>;

export const controls = {
  boolean: () => ({
    control: 'boolean',
  }),

  number: (options: NumberOptions = {}) => ({
    control: { type: 'number', ...options },
  }),

  range: (options: NumberOptions = {}) => ({
    control: { type: 'range', ...options },
  }),

  string: () => ({
    control: 'text',
  }),

  inlineRadio: (options: string[]) => ({
    control: 'inline-radio',
    options,
  }),

  enum: (enumObject: EnumType<string>) => ({
    control: 'inline-radio',
    options: Object.values(enumObject),
  }),

  disabled: () => ({
    table: { disable: true },
  }),
};
