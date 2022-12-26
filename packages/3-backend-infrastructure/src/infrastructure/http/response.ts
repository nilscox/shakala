export class Response<Body = unknown> {
  public readonly headers = new Map<string, string>();

  constructor(public readonly status: number, public readonly body: Body) {}

  static isResponse(object: unknown): object is Response<unknown> {
    return object instanceof Response;
  }

  static ok<Body>(body: Body): Response<Body> {
    return new Response(200, body);
  }

  static paginated<Item>(items: Item[], total: number): Response<Item[]> {
    const response = this.ok(items);

    response.headers.set('Pagination-Total', String(total));

    return response;
  }

  static created<Body>(body: Body): Response<Body> {
    return new Response(201, body);
  }

  static redirect(location: string, status = 301): Response<undefined> {
    const response = new Response(status, undefined);

    response.headers.set('Location', location);

    return response;
  }

  static noContent(): Response<undefined> {
    return new Response(204, undefined);
  }
}
