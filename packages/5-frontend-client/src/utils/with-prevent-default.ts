export const withPreventDefault = (
  handler: React.FormEventHandler<HTMLFormElement>,
): React.FormEventHandler<HTMLFormElement> => {
  return (event) => {
    event.preventDefault();
    return handler(event);
  };
};
