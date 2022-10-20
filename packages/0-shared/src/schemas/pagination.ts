import * as yup from 'yup';

export const paginationQuerySchema = yup
  .object({
    page: yup.string().optional(),
    pageSize: yup.string().optional(),
  })
  .optional()
  .noUnknown()
  .strict();

export type PaginationQueryDto = yup.InferType<typeof paginationQuerySchema>;
