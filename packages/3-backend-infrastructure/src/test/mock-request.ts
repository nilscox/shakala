import { RequestSession, Request, RequestFile } from '../infrastructure';

export class MockRequest implements Request {
  params = new Map<string, string>();
  query = new URLSearchParams();
  body: unknown;
  session = new MockRequestSession();
  file?: RequestFile;

  withParam(key: string, value: string) {
    this.params.set(key, value);
    return this;
  }

  withParams(params: Record<string, string>) {
    Object.entries(params).forEach(([key, value]) => this.withParam(key, value));
    return this;
  }

  withQuery(key: string, value: string) {
    this.query.set(key, value);
    return this;
  }

  withBody<Body>(body: Body) {
    this.body = body;
    return this;
  }

  withSession({ userId }: { userId: string }) {
    this.session.userId = userId;
    return this;
  }

  withFile(file: RequestFile) {
    this.file = file;
    return this;
  }
}

export class MockRequestSession implements RequestSession {
  userId?: string;

  async destroy(): Promise<void> {
    this.userId = undefined;
  }
}
