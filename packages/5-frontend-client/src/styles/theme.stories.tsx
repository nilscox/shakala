import { Meta } from '@storybook/react';
import clsx from 'clsx';
import { CSSProperties } from 'react';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const theme = require('../../tailwind.config');

export default {
  title: 'Theme',
} as Meta;

type SpacingProps = {
  name: string;
  className?: string;
  style?: CSSProperties;
};

const Label = ({ className, children }: { className?: string; children: string }) => (
  <div className={clsx('font-bold text-muted', className)}>{children}</div>
);

const Size = ({ name, className, style }: SpacingProps) => (
  <div className="flex flex-row gap-2 items-center">
    <Label className="w-6 text-right">{name}</Label>
    <div className={clsx('bg-primary', className)} style={style} />
  </div>
);

const screens = theme.theme.screens;
export const breakpoints = () => (
  <>
    <Size className="h-2" style={{ width: screens.sm }} name="sm" />
    <Size className="h-2" style={{ width: screens.md }} name="md" />
  </>
);

export const spacings = () => (
  <>
    <Size className="w-0 h-2" name="0" />
    <Size className="w-0.5 h-2" name="0.5" />
    <Size className="w-1 h-2" name="1" />
    <Size className="w-2 h-2" name="2" />
    <Size className="w-4 h-2" name="4" />
    <Size className="w-5 h-2" name="5" />
    <Size className="w-6 h-2" name="6" />
  </>
);

type BorderRadiusProps = {
  className?: string;
  name: string;
};

const BorderRadius = ({ className, name }: BorderRadiusProps) => (
  <div className="flex flex-row gap-2 items-center">
    <div
      className={clsx('w-6 h-6 border-t border-l', className)}
      style={{ borderEndStartRadius: 0, borderEndEndRadius: 0, borderStartEndRadius: 0 }}
    />
    <Label>{name}</Label>
  </div>
);

export const borderRadius = () => (
  <div className="flex flex-col gap-2">
    <BorderRadius className="rounded" name="default" />
    <BorderRadius className="rounded-lg" name="lg" />
    <BorderRadius className="rounded-full" name="full" />
  </div>
);

type ColorProps = {
  name: string;
  className?: string;
};

const Color = ({ name, className }: ColorProps) => (
  <div className="flex flex-row gap-2 items-center">
    <div className={clsx('w-6 h-6 rounded', className)} />
    <Label>{name}</Label>
  </div>
);

export const backgroundColors = () => (
  <div className="flex flex-col gap-2">
    <Color className="bg-primary" name="primary" />
    <Color className="bg-neutral" name="neutral" />
    <Color className="bg-inverted" name="inverted" />
    <Color className="bg-success" name="success" />
    <Color className="bg-error" name="error" />
    <Color className="bg-warning" name="warning" />
  </div>
);

export const borderColors = () => (
  <>
    <Color className="border" name="default" />
  </>
);

export const boxShadows = () => (
  <>
    <Color className="shadow" name="default" />
  </>
);

type TextProps = {
  name: string;
  className?: string;
};

const Text = ({ name, className }: TextProps) => (
  <div className="flex flex-row gap-2 items-center">
    <Label className="w-[6rem]">{name}</Label>
    <div className={clsx('px-1', className)}>Two driven jocks help fax my big quiz.</div>
    <div className={clsx('px-1 font-bold', className)}>Two driven jocks help fax my big quiz.</div>
  </div>
);

export const textColors = () => (
  <div className="flex flex-col gap-2">
    <Text className="text" name="default" />
    <Text className="text-muted" name="muted" />
    <Text className="text-inverted bg-inverted" name="inverted" />
    <Text className="text-link" name="link" />
    <Text className="text-success" name="success" />
    <Text className="text-warning" name="warning" />
    <Text className="text-error" name="error" />
  </div>
);

type FontFamilyProps = {
  className?: string;
  name: string;
};

const FontFamily = ({ className, name }: FontFamilyProps) => (
  <div className="flex flex-col gap-0.5">
    <Label>{name}</Label>
    <div className={className}>
      <div>abcdefghijklmnopqrstuvwxyz</div>
      <div>ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
      <div>0123456789</div>
    </div>
  </div>
);

const fonts = theme.theme.fontFamily;
export const fontFamilies = () => (
  <div className="flex flex-col gap-2">
    <FontFamily name={fonts.sans.join(', ') + ' (default)'} />
    <FontFamily className="font-open-sans" name={fonts['open-sans'].join(', ')} />
  </div>
);

export const fontSizes = () => (
  <div className="flex flex-col gap-2">
    <Text className="text-sm" name="sm" />
    <Text name="base" />
    <Text className="text-lg" name="lg" />
    <Text className="text-xl" name="xl" />
    <Text className="text-xxl" name="xxl" />
  </div>
);
