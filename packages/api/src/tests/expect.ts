import expect, { assertion } from '@nilscox/expect';

export { expect };

declare global {
  namespace Expect {
    export interface ResponseAssertions extends PromiseAssertions<Promise<Response>> {
      toHaveStatus(status: number): Promise<Response>;
    }

    export interface Assertions extends ResponseAssertions {}

    interface ExpectFunction {
      <Actual extends Promise<Response>>(actual: Actual): ExpectResult<ResponseAssertions, Actual>;
    }
  }
}

expect.addAssertion({
  name: 'toHaveStatus',

  expectedType: 'a Response',
  guard(value: unknown): value is Promise<Response> {
    return value instanceof Promise<Response>;
  },

  async prepareAsync(promise, expectedStatus) {
    const response = await promise;

    return {
      actual: response.status,
      expected: expectedStatus,
      meta: {
        response,
        text: await response.clone().text(),
        json: await response
          .clone()
          .json()
          .catch(() => undefined),
      },
    };
  },

  assert(status, expected, { response }) {
    assertion(status === expected);
    return Promise.resolve(response);
  },

  getMessage(error) {
    const res = error.meta.response;
    const headers: Record<string, string> = {};

    res.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const response = {
      status: res.status,
      headers,
      body: error.meta.json ?? error.meta.text,
    };

    return (
      this.formatter
        // todo: allow to pass options to formatter.expected
        // todo: allow depth: null
        // .expected(response, { depth: null })
        .append('expected')
        .value(response, { depth: 10 })
        .append('to have status')
        .value(error.expected)
        .result()
    );
  },
});
