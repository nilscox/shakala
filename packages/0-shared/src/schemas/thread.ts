import * as yup from 'yup';

import { ReactionTypeDto, Sort } from '../dtos';

export const getLastThreadsQuerySchema = yup.object({
  count: yup.number().min(1).max(50).default(10),
});

export type GetLastThreadsQueryDto = yup.InferType<typeof getLastThreadsQuerySchema>;

export const getThreadQuerySchema = yup.object({
  sort: yup.string().oneOf(Object.values(Sort)).default(Sort.relevance),
  search: yup.string().trim().max(30),
});

export type GetThreadQueryDto = yup.InferType<typeof getThreadQuerySchema>;

export const createThreadBodySchema = yup
  .object({
    description: yup.string().required().trim().min(4).max(60),
    text: yup.string().required().trim().min(4).max(20000),
    keywords: yup.array().of(yup.string().required().trim().min(3).max(20)).required(),
  })
  .required()
  .noUnknown()
  .strict();

export type CreateThreadBodyDto = yup.InferType<typeof createThreadBodySchema>;

export const createCommentBodySchema = yup
  .object({
    threadId: yup.string().required(),
    parentId: yup.string(),
    text: yup.string().required().trim().min(4).max(20000),
  })
  .required()
  .noUnknown()
  .strict();

export type CreateCommentBodyDto = {
  threadId: string;
  parentId?: string;
  text: string;
};

export const editCommentBodySchema = yup
  .object({
    text: yup.string().required().trim().min(4).max(20000),
  })
  .required()
  .noUnknown()
  .strict();

export type EditCommentBodyDto = yup.InferType<typeof editCommentBodySchema>;

export const setReactionBodySchema = yup
  .object({
    type: yup
      .string()
      .nullable()
      .defined()
      .oneOf([...Object.values(ReactionTypeDto), null]),
  })
  .required()
  .noUnknown()
  .strict();

export type SetReactionBodyDto = yup.InferType<typeof setReactionBodySchema>;
