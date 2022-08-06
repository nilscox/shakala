import * as yup from 'yup';

export const loginBodySchema = yup
  .object({
    email: yup.string().required().email(),
    password: yup.string().required(),
  })
  .required()
  .noUnknown()
  .strict();

export type LoginBodyDto = yup.InferType<typeof loginBodySchema>;

export const signupBodySchema = yup
  .object({
    nick: yup.string().required().min(4).max(40),
    email: yup.string().required().email(),
    password: yup.string().required().min(4).max(100),
  })
  .required()
  .noUnknown()
  .strict();

export type SignupBodyDto = yup.InferType<typeof signupBodySchema>;
