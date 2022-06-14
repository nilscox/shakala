import classNames from 'classnames';
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

export enum SnackType {
  success = 'success',
  warning = 'warning',
  error = 'error',
}

type Snack = {
  id: string;
  type: SnackType;
  message: string;
};

const colorsMap: Record<SnackType, string> = {
  [SnackType.success]: 'bg-success/90',
  [SnackType.warning]: 'bg-warning/90',
  [SnackType.error]: 'bg-error/90',
};

export type SnackbarProps = {
  className?: string;
  type: keyof typeof colorsMap;
  children: ReactNode;
};

export const Snackbar = ({ className, type, children }: SnackbarProps) => (
  <div
    className={classNames(
      'p-2 w-fit min-w-snackbar max-w-snackbar font-semibold text-white rounded shadow',
      colorsMap[type],
      className,
    )}
  >
    {children}
  </div>
);

const snackbarContext = createContext<((snack: Snack) => void) | null>(null);

type SnackbarProviderProps = {
  children: ReactNode;
};

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const [snacks, setSnacks] = useState<Snack[]>([]);

  const addSnack = useCallback((snack: Snack) => {
    setSnacks((snacks) => [...snacks, snack]);

    const timeout = setTimeout(() => {
      setSnacks((snacks) => snacks.filter(({ id }) => id !== snack.id));
    }, 6000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <snackbarContext.Provider value={addSnack}>
      <div className="flex fixed top-0 right-0 z-10 flex-col gap-2 m-4">
        {snacks.map((snack) => (
          <Snackbar key={snack.id} type={snack.type}>
            {snack.message}
          </Snackbar>
        ))}
      </div>

      {children}
    </snackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const addSnack = useContext(snackbarContext);

  if (addSnack === null) {
    throw new Error('Missing SnackbarProvider');
  }

  const register = useCallback(
    (type: SnackType) => (message: string) => {
      addSnack({ id: Math.random().toString(36).slice(-6), type, message });
    },
    [addSnack],
  );

  return useMemo(
    () => ({
      success: register(SnackType.success),
      warning: register(SnackType.warning),
      error: register(SnackType.error),
    }),
    [register],
  );
};
