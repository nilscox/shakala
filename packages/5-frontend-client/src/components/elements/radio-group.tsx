import { clsx } from 'clsx';

type RadiosGroupProps = {
  className?: string;
  children: React.ReactNode;
};

export const RadiosGroup = ({ className, children }: RadiosGroupProps) => (
  <div className={clsx('text-clip bg-neutral rounded border row', className)}>{children}</div>
);

type RadioItemProps = {
  id: string;
  name: string;
  title?: string;
  defaultChecked?: boolean;
  children: React.ReactNode;
};

export const RadioItem = ({ id, name, title, defaultChecked, children }: RadioItemProps) => (
  <div className="border-l first-of-type:border-none">
    <input
      type="radio"
      id={id}
      name={name}
      value={id}
      defaultChecked={defaultChecked}
      className="peer sr-only"
    />
    <label
      className="items-center py-0.5 px-2 h-full peer-checked:bg-muted/10 peer-focus-visible:outline cursor-pointer row"
      htmlFor={id}
      title={title}
    >
      {children}
    </label>
  </div>
);
