import * as yup from 'yup';

export const paginationQuerySchema = yup.object({
  page: yup.number().positive().min(1).default(1).optional(),
  pageSize: yup.number().positive().min(1).max(50).default(10).optional(),
});

export type PaginationQuery = yup.InferType<typeof paginationQuerySchema>;
