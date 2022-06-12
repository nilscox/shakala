export class Response<Body = unknown> {
  public readonly headers = new Map<string, string>();

  protected constructor(public readonly status: number, public readonly body: Body) {}

  static isResponse(object: unknown): object is Response<unknown> {
    return object instanceof Response;
  }

  static ok<Body>(body: Body): Response<Body> {
    return new Response(200, body);
  }

  static created<Body>(body: Body): Response<Body> {
    return new Response(201, body);
  }

  static noContent(): Response<undefined> {
    return new Response(204, undefined);
  }
}
