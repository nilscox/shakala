import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';

import { Snackbar, SnackbarProps } from './snackbar';
import { SnackbarProvider } from './snackbar-provider';
import { SnackType } from './snackbar.types';
import { useSnackbar } from './use-snackbar';

export default {
  title: 'Elements/Snackbar',
  decorators: [
    (Story) => (
      <SnackbarProvider>
        <Story />
      </SnackbarProvider>
    ),
  ],
} as Meta;

const Template: Story<Partial<SnackbarProps> & { children: string }> = (props) => (
  <Snackbar type={SnackType.success} transition={undefined} onRemove={action('remove')} {...props} />
);

export const success = () => <Template type={SnackType.success}>Bien joué !</Template>;

export const info = () => <Template type={SnackType.info}>Bin dis donc...</Template>;

export const warning = () => <Template type={SnackType.warning}>Hmm... t'es sûr ?</Template>;

export const error = () => <Template type={SnackType.error}>Pas vraiment, non.</Template>;

export const long = () => (
  <Template>
    Demain dès l'aube, à l'heure où blanchit ma compagne, je partirai. Vois-tu, je sais que tu m'attends.
    J'irai par delà... j'me souviens plus.
  </Template>
);

export const trigger = () => {
  const snackbar = useSnackbar();

  return <button onClick={() => snackbar.success('Pas mal, non ?')}>Trigger snackbar</button>;
};
