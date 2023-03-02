export const toKebabCase = (str: string) => {
  if (str === '') {
    return '';
  }

  return (str[0] + str.slice(1).replace(/([A-Z])/g, '-$1')).toLowerCase();
};
