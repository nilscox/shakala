import { Request } from 'express';
import * as yup from 'yup';

export const validateRequestBody = <Schema extends yup.Schema>(request: Request, schema: Schema) => {
  return schema.required().noUnknown().strict().validate(request.body, { strict: true, abortEarly: false });
};
