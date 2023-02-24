import * as yup from 'yup';

export const signUpBodySchema = yup.object({
  nick: yup.string().min(4).max(48).required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).max(255).required(),
});

export type SignUpBody = yup.InferType<typeof signUpBodySchema>;

export const signInBodySchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).max(255).required(),
});

export type SignInBody = yup.InferType<typeof signInBodySchema>;
