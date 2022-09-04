import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

import { Snackbar } from './snackbar';
import { Snack } from './snackbar.types';

export const duration = 6000;
export const fadeDuration = 280;

type SnackbarContext = {
  snacks: Snack[];
  addSnack: (snack: Snack) => void;
  removeSnack: (snackId: string) => void;
  updateSnack: (snack: Partial<Snack>) => void;
};

const snackbarContext = createContext<SnackbarContext>({} as SnackbarContext);

export const useSnackbarContext = () => {
  return useContext(snackbarContext);
};

type SnackbarProviderProps = {
  children: ReactNode;
};

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const [snacks, setSnacks] = useState<Snack[]>([]);

  const updateSnack = useCallback<SnackbarContext['updateSnack']>(({ id, ...changes }) => {
    setSnacks((snacks) => {
      const index = snacks.findIndex((snack) => snack.id === id);

      if (index < 0) {
        return snacks;
      }

      return [
        //
        ...snacks.slice(0, index - 1),
        { ...snacks[index], ...changes },
        ...snacks.slice(index + 1),
      ];
    });
  }, []);

  const removeSnack = useCallback<SnackbarContext['removeSnack']>((snackId) => {
    setSnacks((snacks) => {
      return snacks.filter((snack) => snack.id !== snackId);
    });
  }, []);

  const addSnack = useCallback<SnackbarContext['addSnack']>(
    (snack) => {
      setSnacks((snacks) => [...snacks, snack]);

      setTimeout(() => {
        updateSnack({ id: snack.id, transition: undefined });
      }, fadeDuration);

      setTimeout(() => {
        updateSnack({ id: snack.id, transition: 'out' });
      }, duration - fadeDuration);

      setTimeout(() => {
        removeSnack(snack.id);
      }, duration);
    },
    [updateSnack, removeSnack],
  );

  return (
    <snackbarContext.Provider value={{ snacks, addSnack, updateSnack, removeSnack }}>
      {children}

      {createPortal(
        <div className="fixed top-0 right-0 z-10 m-4 flex flex-col gap-2">
          {snacks.map((snack) => (
            <Snackbar
              key={snack.id}
              type={snack.type}
              transition={snack.transition}
              onRemove={() => removeSnack(snack.id)}
            >
              {snack.message}
            </Snackbar>
          ))}
        </div>,
        document.body,
      )}
    </snackbarContext.Provider>
  );
};
