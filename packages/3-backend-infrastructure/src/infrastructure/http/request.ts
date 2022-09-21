export type RequestFile = {
  name: string;
  data: Buffer;
  type: string;
};

export interface Request {
  params: Map<string, string>;
  query: URLSearchParams;
  body: unknown;
  session: RequestSession;
  file?: RequestFile;
}

export interface RequestSession {
  userId?: string;
  destroy(): Promise<void>;
}
