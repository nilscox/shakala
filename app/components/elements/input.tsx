import classNames from 'classnames';

type InputProps = React.ComponentProps<'input'> & {
  onTextChange?: (text: string, event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Input = ({ className, onTextChange, onChange, ...props }: InputProps): JSX.Element => (
  <input
    className={classNames('py-0.5 px-1 rounded border border-light-gray/60', className)}
    onChange={(event) => {
      onChange?.(event);
      onTextChange?.(event.currentTarget.value, event);
    }}
    {...props}
  />
);
