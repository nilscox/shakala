export interface Request {
  params: Map<string, string>;
  query: URLSearchParams;
  body: unknown;
  session: RequestSession;
}

export interface RequestSession {
  userId?: string;
  destroy(): Promise<void>;
}
