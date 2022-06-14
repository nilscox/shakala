import { action } from '@storybook/addon-actions';

export const gatewayAction = async <T>(
  gateway: { constructor: { name: string } },
  method: string,
  args: unknown[],
  result: T,
) => {
  action([gateway.constructor.name, method].join('.'))(args);

  await new Promise((r) => setTimeout(r, 650));

  return result;
};
