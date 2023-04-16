import * as yup from 'yup';

export const updateUserProfileBodySchema = yup.object({
  nick: yup.string().min(4).max(48),
});

export type UpdateUserProfileBody = yup.InferType<typeof updateUserProfileBodySchema>;
