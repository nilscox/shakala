import { UnexpectedError } from 'shared';
import * as yup from 'yup';

import { MockRequest } from '../../../test';

import { ValidationError, ValidationService } from './validation.service';

describe('ValidationService', () => {
  const missingFieldError = (field: string) => {
    return new ValidationError([{ field, error: 'required', messages: [`${field} is a required field`] }]);
  };

  it("validates a request's query params", async () => {
    const service = new ValidationService();

    const schema = yup.object({ id: yup.string().required() });

    await expect.async(service.query(new MockRequest().withQuery('id', 'value'), schema)).toEqual({
      id: 'value',
    });

    await expect
      .rejects(service.query(new MockRequest().withQuery('other', 'value'), schema))
      .with(missingFieldError('id'));
  });

  it("validates a request's pagination query params", async () => {
    const service = new ValidationService();

    await expect.async(service.pagination(new MockRequest())).toEqual({
      page: undefined,
      pageSize: undefined,
    });

    await expect
      .async(service.pagination(new MockRequest().withQuery('page', '2').withQuery('pageSize', '4')))
      .toEqual({
        page: 2,
        pageSize: 4,
      });
  });

  it("validates a request's body", async () => {
    const service = new ValidationService();

    const schema = yup.object({ age: yup.number().required().min(18) });

    await expect.async(service.body(new MockRequest().withBody({ age: 29 }), schema)).toEqual({
      age: 29,
    });

    await expect.rejects(service.body(new MockRequest(), schema)).with(UnexpectedError);

    await expect.rejects(service.body(new MockRequest().withBody({}), schema)).with(missingFieldError('age'));

    await expect
      .rejects(service.body(new MockRequest().withBody({ age: 12 }), schema))
      .with(
        new ValidationError([
          { field: 'age', error: 'min', value: 12, messages: ['age must be greater than or equal to 18'] },
        ]),
      );
  });
});
