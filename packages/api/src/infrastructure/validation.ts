import { paginationQuerySchema } from '@shakala/shared';
import { Request } from 'express';
import * as yup from 'yup';

export const validateRequest = (request: Request<unknown>) => {
  const validate = (value: unknown) => {
    return <Schema extends yup.Schema>(schema: Schema): Promise<yup.InferType<Schema>> => {
      return schema.required().noUnknown().validate(value, { abortEarly: false });
    };
  };

  return {
    query: validate(request.query),
    body: validate(request.body),

    pagination() {
      return this.query(paginationQuerySchema);
    },
  };
};
