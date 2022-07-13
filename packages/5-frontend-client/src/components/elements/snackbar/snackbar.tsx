import clsx from 'clsx';
import { createContext, ReactNode, SVGProps, useCallback, useContext, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import CheckIcon from '~/icons/check.svg';
import CrossIcon from '~/icons/cross.svg';
import ExplanationMarkIcon from '~/icons/explanation-mark.svg';

import { IconButton } from '../icon-button';

export enum SnackType {
  success = 'success',
  warning = 'warning',
  error = 'error',
}

type Snack = {
  id: string;
  type: SnackType;
  transition: 'in' | 'out' | undefined;
  message: string;
};

const duration = 6000;
const fadeDuration = 280;

const colorsMap: Record<SnackType, string> = {
  [SnackType.success]: 'text-success border-success/90',
  [SnackType.warning]: 'text-warning border-warning/90',
  [SnackType.error]: 'text-error border-error/90',
};

const iconsMap: Record<SnackType, React.ComponentType<SVGProps<SVGSVGElement>>> = {
  [SnackType.success]: CheckIcon,
  [SnackType.warning]: ExplanationMarkIcon,
  [SnackType.error]: CrossIcon,
};

export type SnackbarProps = {
  className?: string;
  id: string;
  type: SnackType;
  transition: Snack['transition'];
  children: ReactNode;
};

export const Snackbar = ({ className, id, type, transition, children }: SnackbarProps) => {
  const Icon = iconsMap[type];
  const { removeSnack } = useContext(snackbarContext);

  return (
    <div
      className={clsx(
        'w-fit min-w-snackbar max-w-snackbar font-semibold bg-neutral/90 rounded-lg border-2 shadow',
        colorsMap[type],
        {
          'animate-fade-in': transition === 'in',
          'animate-fade-out': transition === 'out',
        },
        className,
      )}
    >
      <div className="gap-2 p-2 bg-muted/10 rounded row">
        <div className="self-center">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">{children}</div>
        <div>
          <IconButton icon={<CrossIcon className="w-4 h-4 text-muted" />} onClick={() => removeSnack(id)} />
        </div>
      </div>
    </div>
  );
};

type SnackbarContext = {
  snacks: Snack[];
  addSnack: (snack: Snack) => void;
  removeSnack: (snackId: string) => void;
  updateSnack: (snack: Partial<Snack>) => void;
};

const snackbarContext = createContext<SnackbarContext>({} as SnackbarContext);

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
        <div className="flex fixed top-0 right-0 z-10 flex-col gap-2 m-4">
          {snacks.map((snack) => (
            <Snackbar key={snack.id} id={snack.id} type={snack.type} transition={snack.transition}>
              {snack.message}
            </Snackbar>
          ))}
        </div>,
        document.body,
      )}
    </snackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const { addSnack } = useContext(snackbarContext);

  if (addSnack === null) {
    throw new Error('Missing SnackbarProvider');
  }

  const register = useCallback(
    (type: SnackType) => (message: string) => {
      addSnack({
        id: Math.random().toString(36).slice(-6),
        type,
        transition: 'in',
        message,
      });
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
