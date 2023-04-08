import { Meta } from '@storybook/react';
import { clsx } from 'clsx';
import { CSSProperties } from 'react';

export default {
  title: 'Theme',
} satisfies Meta;

type SpacingProps = {
  name: string;
  className?: string;
  style?: CSSProperties;
};

const Label = ({ className, children }: { className?: string; children: string }) => (
  <div className={clsx('font-bold text-muted', className)}>{children}</div>
);

const Size = ({ name, className, style }: SpacingProps) => (
  <div className="flex flex-row items-center gap-2">
    <Label className="w-6 text-right">{name}</Label>
    <div className={clsx('bg-primary', className)} style={style} />
  </div>
);

const screens = { sm: '480px', md: '768px' };
export const breakpoints = () => (
  <>
    <Size className="h-2" style={{ width: screens.sm }} name="sm" />
    <Size className="h-2" style={{ width: screens.md }} name="md" />
  </>
);

export const spacings = () => (
  <>
    <Size className="h-2 w-0" name="0" />
    <Size className="h-2 w-px" name="px" />
    <Size className="h-2 w-0.5" name="0.5" />
    <Size className="h-2 w-1" name="1" />
    <Size className="h-2 w-2" name="2" />
    <Size className="h-2 w-4" name="4" />
    <Size className="h-2 w-5" name="5" />
    <Size className="h-2 w-6" name="6" />
    <Size className="h-2 w-8" name="8" />
    <Size className="h-2 w-10" name="10" />
    <Size className="h-2 w-12" name="12" />
    <Size className="h-2 w-16" name="16" />
  </>
);

export const widths = () => (
  <>
    <Size className="h-2 min-w-1" name="1" />
    <Size className="h-2 min-w-2" name="2" />
    <Size className="h-2 min-w-3" name="3" />
    <Size className="h-2 min-w-4" name="4" />
    <Size className="h-2 min-w-5" name="5" />
    <Size className="h-2 min-w-6" name="6" />
  </>
);

export const heights = () => (
  <div className="row items-end gap-4">
    <Size className="min-h-1 w-2" name="1" />
    <Size className="min-h-2 w-2" name="2" />
    <Size className="min-h-3 w-2" name="3" />
  </div>
);

type BorderRadiusProps = {
  className?: string;
  name: string;
};

const BorderRadius = ({ className, name }: BorderRadiusProps) => (
  <div className="flex flex-row items-center gap-2">
    <div
      className={clsx('h-6 w-6 border-t border-l', className)}
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
  <div className="flex flex-row items-center gap-2">
    <div className={clsx('h-6 w-6 rounded', className)} />
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
  <div className="flex flex-row items-center gap-2">
    <Label className="w-12">{name}</Label>
    <div className={clsx('px-1', className)}>Two driven jocks help fax my big quiz.</div>
    <div className={clsx('px-1 font-bold', className)}>Two driven jocks help fax my big quiz.</div>
  </div>
);

export const textColors = () => (
  <div className="flex flex-col gap-2">
    <Text className="text" name="default" />
    <Text className="text-muted" name="muted" />
    <Text className="bg-inverted text-inverted" name="inverted" />
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

const fonts: Record<string, string[]> = {
  sans: ['Open SansVariable', 'sans-serif'],
  'open-sans': ['Open Sans', 'sans-serif'],
};
export const fontFamilies = () => (
  <div className="flex flex-col gap-2">
    <FontFamily name={fonts.sans.join(', ') + ' (default)'} />
    <FontFamily className="font-open-sans" name={fonts['open-sans'].join(', ')} />
  </div>
);

export const fontSizes = () => (
  <div className="flex flex-col gap-2">
    <Text className="text-xs" name="sm" />
    <Text name="base" />
    <Text className="text-lg" name="lg" />
    <Text className="text-xl" name="xl" />
    <Text className="text-xxl" name="xxl" />
  </div>
);

export const typographies = () => (
  <div className="flex flex-col gap-2">
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <div>Regular text</div>
  </div>
);
