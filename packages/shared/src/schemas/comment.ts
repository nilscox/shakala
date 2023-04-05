import * as yup from 'yup';

const minRichTextLength = (length: number) => '<p></p>'.length + length;

export const createCommentBodySchema = yup.object({
  text: yup.string().required().trim().min(minRichTextLength(4)).max(20000),
});

export type CreateCommentBody = yup.InferType<typeof createCommentBodySchema>;

export const editCommentBodySchema = yup.object({
  text: yup.string().required().trim().min(minRichTextLength(4)).max(20000),
});

export type EditCommentBody = yup.InferType<typeof editCommentBodySchema>;

export enum ReactionType {
  upvote = 'upvote',
  downvote = 'downvote',
}

export const setReactionBodySchema = yup.object({
  type: yup
    .string()
    .nullable()
    .defined()
    .oneOf([...Object.values(ReactionType), null]),
});

export type SetReactionBody = yup.InferType<typeof setReactionBodySchema>;

export const reportCommentBodySchema = yup.object({
  reason: yup.string().optional(),
});

export type ReportCommentBody = yup.InferType<typeof reportCommentBodySchema>;
