import { clsx } from 'clsx';
import { ReactNode, SVGProps } from 'react';

import CheckIcon from '~/icons/check.svg';
import CrossIcon from '~/icons/cross.svg';
import ExplanationMarkIcon from '~/icons/explanation-mark.svg';

import { IconButton } from '../icon-button';

import { Snack, SnackType } from './snackbar.types';

const colorsMap: Record<SnackType, string> = {
  [SnackType.success]: 'text-success border-success',
  [SnackType.warning]: 'text-warning border-warning',
  [SnackType.error]: 'text-error border-error',
};

const iconColorsMap: Record<SnackType, string> = {
  [SnackType.success]: 'bg-success',
  [SnackType.warning]: 'bg-warning',
  [SnackType.error]: 'bg-error',
};

const iconsMap: Record<SnackType, React.ComponentType<SVGProps<SVGSVGElement>>> = {
  [SnackType.success]: CheckIcon,
  [SnackType.warning]: ExplanationMarkIcon,
  [SnackType.error]: CrossIcon,
};

export type SnackbarProps = {
  className?: string;
  type: SnackType;
  transition: Snack['transition'];
  onRemove: () => void;
  children: ReactNode;
};

export const Snackbar = ({ className, type, transition, onRemove, children }: SnackbarProps) => {
  const Icon = iconsMap[type];

  return (
    <div
      className={clsx(
        'w-fit min-w-1 max-w-4 overflow-hidden rounded-lg border-2 bg-neutral font-semibold shadow',
        colorsMap[type],
        {
          'animate-fade-in': transition === 'in',
          'animate-fade-out': transition === 'out',
        },
        className,
      )}
    >
      <div className="row notification items-stretch gap-2 rounded">
        <div className={clsx('col justify-center p-2', iconColorsMap[type])}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 p-2">{children}</div>
        <div className="py-4 px-2">
          <IconButton
            icon={<CrossIcon className="h-4 w-4 text-muted" />}
            onClick={onRemove}
            aria-label="Fermer"
          />
        </div>
      </div>
    </div>
  );
};
