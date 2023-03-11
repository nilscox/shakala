import { Request } from 'express';
import * as yup from 'yup';

export const validateRequest = (request: Request) => {
  const validate = (value: unknown) => {
    return <Schema extends yup.Schema>(schema: Schema): Promise<yup.InferType<Schema>> => {
      return schema.required().noUnknown().validate(value, { abortEarly: false });
    };
  };

  return {
    query: validate(request.query),
    body: validate(request.body),
  };
};
