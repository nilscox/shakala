import * as yup from 'yup';

import { isEnumValue } from '../utils/is-enum-value';

export enum CommentSort {
  dateAsc = 'date-asc',
  dateDesc = 'date-desc',
  relevance = 'relevance',
}

export const isCommentSort = isEnumValue(CommentSort);

export const getLastThreadsQuerySchema = yup.object({
  count: yup.number().min(1).max(50).default(10),
});

export type GetLastThreadsQuery = yup.InferType<typeof getLastThreadsQuerySchema>;

export const getThreadQuerySchema = yup.object({
  sort: yup.string().oneOf(Object.values(CommentSort)).default(CommentSort.relevance),
  search: yup.string().trim().max(30),
});

export type GetThreadCommentsQuery = yup.InferType<typeof getThreadQuerySchema>;

export const createOrEditThreadBodySchema = yup.object({
  description: yup.string().required().trim().min(4).max(60),
  keywords: yup.array().of(yup.string().required().trim().min(3).max(20)).max(20).required(),
  text: yup.string().required().trim().min(4).max(20000),
});

export type CreateOrEditThreadBody = yup.InferType<typeof createOrEditThreadBodySchema>;
