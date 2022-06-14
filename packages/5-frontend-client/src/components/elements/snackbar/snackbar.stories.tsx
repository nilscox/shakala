import { Meta, Story } from '@storybook/react';

import { Snackbar, SnackbarProps, SnackbarProvider, SnackType, useSnackbar } from './snackbar';

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

const Template: Story<Partial<SnackbarProps>> = (props) => (
  // eslint-disable-next-line react/no-children-prop
  <Snackbar type={SnackType.success} children={null} {...props} />
);

export const success = () => <Template type={SnackType.success}>Bien joué !</Template>;

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
