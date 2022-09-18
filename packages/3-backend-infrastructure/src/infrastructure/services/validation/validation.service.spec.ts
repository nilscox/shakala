import * as yup from 'yup';

import { MockRequest } from '../../../test';
import { BadRequest } from '../../http/http-errors';

import { ValidationError, ValidationService } from './validation.service';

describe('ValidationService', () => {
  const missingFieldError = (field: string) => {
    return new ValidationError([{ field, error: 'required', messages: [`${field} is a required field`] }]);
  };

  it("validates a request's query params", async () => {
    const service = new ValidationService();

    const schema = yup.object({ limit: yup.string().required() });

    await expect(service.query(new MockRequest().withQuery('limit', 'value'), schema)).resolves.toEqual({
      limit: 'value',
    });

    await expect(service.query(new MockRequest().withQuery('other', 'value'), schema)).rejects.toEqual(
      missingFieldError('limit'),
    );
  });

  it("validates a request's body", async () => {
    const service = new ValidationService();

    const schema = yup.object({ age: yup.number().required().min(18) });

    await expect(service.body(new MockRequest().withBody({ age: 29 }), schema)).resolves.toEqual({
      age: 29,
    });

    await expect(service.body(new MockRequest(), schema)).rejects.toEqual(
      new BadRequest('MissingBody', 'the request body is required'),
    );

    await expect(service.body(new MockRequest().withBody({}), schema)).rejects.toEqual(
      missingFieldError('age'),
    );

    await expect(service.body(new MockRequest().withBody({ age: 12 }), schema)).rejects.toEqual(
      new ValidationError([
        { field: 'age', error: 'min', value: 12, messages: ['age must be greater than or equal to 18'] },
      ]),
    );
  });
});
