import { RequestSession, Request } from '../infrastructure';

export class MockRequest implements Request {
  params = new Map<string, string>();
  query = new URLSearchParams();
  body: unknown;
  session = new MockRequestSession();

  withParam(key: string, value: string) {
    this.params.set(key, value);
    return this;
  }

  withQuery(key: string, value: string) {
    this.query.set(key, value);
    return this;
  }

  withBody(body: unknown) {
    this.body = body;
    return this;
  }
}

export class MockRequestSession implements RequestSession {
  userId?: string;

  async destroy(): Promise<void> {
    this.userId = undefined;
  }
}
