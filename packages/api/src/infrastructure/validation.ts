import { Request } from 'express';
import * as yup from 'yup';

export const validateRequestQuery = <Schema extends yup.Schema>(
  request: Request,
  schema: Schema
): Promise<yup.InferType<Schema>> => {
  return schema.required().noUnknown().validate(request.query, { abortEarly: false });
};

export const validateRequestBody = <Schema extends yup.Schema>(
  request: Request,
  schema: Schema
): Promise<yup.InferType<Schema>> => {
  return schema.required().noUnknown().validate(request.body, { abortEarly: false });
};
