import { EnumType } from '@shakala/shared';
import { action } from '@storybook/addon-actions';
import { Decorator } from '@storybook/react';
import { ContainerProvider, useInjection } from 'brandi-react';

import { StubAuthenticationAdapter } from '~/adapters/api/authentication/stub-authentication.adapter';
import { StubThreadAdapter } from '~/adapters/api/thread/stub-thread.adapter';
import { RouterPort } from '~/adapters/router/router.port';
import { container } from '~/app/container';
import { TOKENS } from '~/app/tokens';

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

class StorybookRouterAdapter implements RouterPort {
  navigate = action('navigate');
}

export const containerDecorator: Decorator = (Story) => {
  container.bind(TOKENS.router).toInstance(StorybookRouterAdapter).inSingletonScope();
  container.bind(TOKENS.authentication).toInstance(StubAuthenticationAdapter).inSingletonScope();
  container.bind(TOKENS.thread).toInstance(StubThreadAdapter).inSingletonScope();

  return (
    <ContainerProvider container={container}>
      <Story />
    </ContainerProvider>
  );
};

type StubApiAdapters = {
  authentication: StubAuthenticationAdapter;
  thread: StubThreadAdapter;
};

type ConfigureStory = (adapters: StubApiAdapters) => void;

export const configureStory = (configure: ConfigureStory): Decorator => {
  // eslint-disable-next-line react/display-name
  return (Story) => {
    configure({
      authentication: useInjection(TOKENS.authentication),
      thread: useInjection(TOKENS.thread),
    } as StubApiAdapters);

    return <Story />;
  };
};

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
