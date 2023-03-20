import { EnumType } from '@shakala/shared';
import { Decorator } from '@storybook/react';

import { SnackbarProvider } from '../elements/snackbar';

export const maxWidthDecorator: Decorator = (Story) => (
  <div className="max-w-6">
    <Story />
  </div>
);

export const snackbarDecorator: Decorator = (Story) => (
  <SnackbarProvider>
    <Story />
  </SnackbarProvider>
);

type NumberOptions = Partial<Record<'min' | 'max' | 'step', number>>;

type Control<T> = {
  defaultValue?: T;
  argTypes: object;
};

type Controls = {
  boolean(defaultValue?: boolean): Control<boolean>;
  number(defaultValue?: number, options?: NumberOptions): Control<number>;
  range(defaultValue?: number, options?: NumberOptions): Control<number>;
  string(defaultValue?: string): Control<string>;
  inlineRadio<T extends string>(options: T[], defaultValue?: T): Control<T>;
  enum<T extends string>(enumObject: EnumType<T>, defaultValue?: T): Control<T>;
  disabled(): Control<never>;
};

const controlFunctions: Controls = {
  boolean: (defaultValue) => ({
    defaultValue,
    argTypes: {
      control: 'boolean',
    },
  }),

  number: (defaultValue, options = {}) => ({
    defaultValue,
    argTypes: {
      control: { type: 'number', ...options },
    },
  }),

  range: (defaultValue, options = {}) => ({
    defaultValue,
    argTypes: {
      control: { type: 'range', ...options },
    },
  }),

  string: (defaultValue) => ({
    defaultValue,
    argTypes: {
      control: 'text',
    },
  }),

  inlineRadio: (options, defaultValue) => ({
    defaultValue,
    argTypes: {
      control: 'inline-radio',
      options,
    },
  }),

  enum: (enumObject, defaultValue) => ({
    defaultValue: defaultValue ?? Object.values(enumObject)[0],
    argTypes: {
      control: 'inline-radio',
      options: Object.values(enumObject),
    },
  }),

  disabled: () => ({
    argTypes: {
      table: { disable: true },
    },
  }),
};

export const controls = <Args,>(
  configure: (controls: Controls) => { [Key in keyof Args]: Control<Args[Key]> }
): { args: Args; argTypes: object } => {
  const args = {} as Args;
  const argTypes: Record<string, object> = {};

  for (const [key, control] of Object.entries<Control<unknown>>(configure(controlFunctions))) {
    args[key as keyof Args] = control.defaultValue as Args[keyof Args];
    argTypes[key] = control.argTypes;
  }

  return {
    args,
    argTypes,
  };
};
