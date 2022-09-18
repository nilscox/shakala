import { action } from '@storybook/addon-actions';
import { wait } from 'shared';

export const gatewayAction = async <T>(
  gateway: { constructor: { name: string } },
  method: string,
  args: unknown[],
  result: T,
) => {
  action([gateway.constructor.name, method].join('.'))(args);

  await wait(650);

  return result;
};
