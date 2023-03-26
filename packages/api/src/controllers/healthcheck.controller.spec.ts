import expect from '@nilscox/expect';
import { beforeEach, describe, it } from 'vitest';

import { createControllerTest, ControllerTest } from '../tests/controller-test';

describe('[intg] HealthcheckController', () => {
  const getTest = createControllerTest(Test);
  let test: Test;

  beforeEach(async () => {
    test = await getTest();
  });

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

class Test extends ControllerTest {
  agent = this.createAgent();
}
