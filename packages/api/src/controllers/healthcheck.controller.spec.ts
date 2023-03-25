import expect from '@nilscox/expect';
import { afterEach, beforeEach, describe, it } from 'vitest';

import { IntegrationTest } from '../tests/integration-test';

describe('[intg] HealthcheckController', () => {
  let test: Test;

  beforeEach(async () => {
    test = new Test();
    await test.setup();
  });

  afterEach(() => test?.cleanup());

  describe('GET /healthcheck', () => {
    const route = '/healthcheck';

    it('ends with status 200', async () => {
      const response = await expect(test.agent.get(route)).toHaveStatus(200);
      const body = await response.json();

      expect<object>(body).toHaveProperty('api', true);
    });
  });

  describe('GET /version', () => {
    const route = '/version';

    it('return the current api version', async () => {
      const response = await expect(test.agent.get(route)).toHaveStatus(200);
      const text = await response.text();

      expect(text).toEqual(expect.any(String));
    });
  });
});

class Test extends IntegrationTest {
  agent = this.createAgent();
}
