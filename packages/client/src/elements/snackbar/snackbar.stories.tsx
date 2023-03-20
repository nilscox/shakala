import { action } from '@storybook/addon-actions';
import { Meta, StoryFn } from '@storybook/react';

import { Snackbar } from './snackbar';
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
} satisfies Meta;

export const snackbar: StoryFn = () => (
  <div className="col gap-6 items-start">
    <Snackbar type={SnackType.success} transition={undefined} onRemove={action('onRemove')}>
      Bien joué !
    </Snackbar>

    <Snackbar type={SnackType.info} transition={undefined} onRemove={action('onRemove')}>
      Bin dis donc...
    </Snackbar>

    <Snackbar type={SnackType.warning} transition={undefined} onRemove={action('onRemove')}>
      Hmm... t'es sûr ?
    </Snackbar>

    <Snackbar type={SnackType.error} transition={undefined} onRemove={action('onRemove')}>
      Pas vraiment, non.
    </Snackbar>
    <Snackbar type={SnackType.success} transition={undefined} onRemove={action('onRemove')}>
      Demain dès l'aube, à l'heure où blanchit ma compagne, je partirai. Vois-tu, je sais que tu m'attends.
      J'irai par delà... j'me souviens plus.
    </Snackbar>

    <Trigger />
  </div>
);

const Trigger = () => {
  const snackbar = useSnackbar();
  return <button onClick={() => snackbar.success('Pas mal, non ?')}>Trigger snackbar</button>;
};
