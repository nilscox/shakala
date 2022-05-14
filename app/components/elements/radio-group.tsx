import classNames from 'classnames';

type RadiosGroupProps = {
  className?: string;
  children: React.ReactNode;
};

export const RadiosGroup = ({ className, children }: RadiosGroupProps) => (
  <div className={classNames('flex flex-row bg-white rounded border border-light-gray', className)}>
    {children}
  </div>
);

type RadioItemProps = {
  id: string;
  name: string;
  title?: string;
  defaultChecked?: boolean;
  children: React.ReactNode;
};

export const RadioItem = ({ id, name, title, defaultChecked, children }: RadioItemProps) => (
  <div className="border-l border-light-gray first-of-type:border-none">
    <input
      type="radio"
      id={id}
      name={name}
      value={id}
      defaultChecked={defaultChecked}
      className="peer sr-only"
    />
    <label
      className="flex flex-row py-0.5 px-2 peer-checked:bg-light-gray/50 peer-focus-visible:outline cursor-pointer"
      htmlFor={id}
      title={title}
    >
      {children}
    </label>
  </div>
);
