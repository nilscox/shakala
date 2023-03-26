import { Server } from 'http';
import { AddressInfo } from 'net';
import { promisify } from 'util';

import expect from '@nilscox/expect';
import { getProfileImage } from '@shakala/user';
import express from 'express';
import { beforeEach, describe, it } from 'vitest';

import { createControllerTest, ControllerTest } from '../tests/controller-test';

describe('[intg] UserController', () => {
  const getTest = createControllerTest(Test);
  let test: Test;

  beforeEach(async () => {
    test = await getTest();
  });

  describe('GET /:userId/profile-image', () => {
    const route = '/user/userId/profile-image';

    it("retrieves a user's profile image", async () => {
      test.queryBus.on(getProfileImage({ userId: 'userId' })).return(`${test.remoteUrl}/endpoint`);

      const response = await expect(test.createAgent().get(route)).toHaveStatus(200);

      expect(response.headers.get('Content-Type')).toEqual('image/png; charset=utf-8');
      expect(await response.text()).toEqual('result');
    });
  });
});

class Test extends ControllerTest {
  app = express();
  httpServer?: Server;

  get remoteUrl() {
    const info = this.httpServer?.address() as AddressInfo;

    if (info) {
      return `http://localhost:${info.port}`;
    }
  }

  async arrange() {
    this.app.get('/endpoint', (req, res) => {
      res.status(200);
      res.set('Content-Type', 'image/png');
      res.send('result');
    });

    await new Promise((resolve) => {
      this.httpServer = this.app.listen(resolve);
    });
  }

  async cleanup() {
    if (this.httpServer) {
      await promisify(this.httpServer.close.bind(this.httpServer))();
    }
  }
}
