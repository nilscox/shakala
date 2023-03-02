import * as yup from 'yup';

export const createThreadBodySchema = yup.object({
  description: yup.string().required().trim().min(4).max(60),
  text: yup.string().required().trim().min(4).max(20000),
  keywords: yup.array().of(yup.string().required().trim().min(3).max(20)).max(20).required(),
});

export type CreateThreadBody = yup.InferType<typeof createThreadBodySchema>;
