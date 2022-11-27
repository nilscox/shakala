import { EntityActions, EntityAdapter } from '@nilscox/redux-kooltik';

import { normalizeComment, normalizeComments } from '../../normalization';

import { NormalizedComment } from './comment.types';
import {
  closeReplyForm,
  createReply,
  getInitialReplyText,
  saveDraftReply,
} from './create-reply/create-reply';
import {
  closeCommentEditionForm,
  editComment,
  getInitialEditionText,
  saveDraftEditionText,
} from './edit-comment/edit-comment';
import { fetchComments } from './fetch-comments/fetch-comments';
import { openDraftComments } from './open-draft-comments/open-draft-comments';
import { openReportModal } from './open-report-modal/open-report-modal';
import { reportComment } from './report-comment/report-comment';
import { setReaction } from './set-reaction/set-reaction';

export type CommentMeta = {
  fetching: boolean;
  fetchError?: unknown;
};

class CommentActions extends EntityActions<NormalizedComment, CommentMeta> {
  private adapter = new EntityAdapter<NormalizedComment>((comment) => comment.id);

  constructor() {
    super('comment', {
      fetching: false,
    });
  }

  setNormalizedComments = this.action('set-comments', this.adapter.setMany);

  setComment = this.action('set-comment', normalizeComment, this.adapter.setOne);
  addComment = this.action('add-comment', normalizeComment, this.adapter.addOne);
  addComments = this.action('add-comments', normalizeComments, this.adapter.addMany);

  setFetching = this.createSetter('fetching');
  setFetchError = this.createSetter('fetchError', 'set-fetch-error');

  setText = this.entityAction(
    'comment/set-text',
    (comment: NormalizedComment, { text, now }: { text: string; now: string }) => {
      comment.history.push({
        date: comment.edited || comment.date,
        text: comment.text,
      });

      comment.text = text;
      comment.edited = now;
    },
  );

  setEditing = this.setEntityProperty('editing');
  setReplying = this.setEntityProperty('replying');

  addReply = this.entityAction('comment/add-reply', normalizeComment, (comment, reply) => {
    comment.replies.push(reply.id);
  });

  setUserReaction = this.setEntityProperty('userReaction', 'set-user-reaction');
  unsetUserReaction = this.entityAction('comment/unset-user-reaction', (comment: NormalizedComment) => {
    delete comment.userReaction;
  });

  setCommentReactionCounts = this.entityAction(
    'comment/set-reaction-counts',
    (comment: NormalizedComment, counts: { upvotes: number; downvotes: number }) => {
      comment.upvotes = counts.upvotes;
      comment.downvotes = counts.downvotes;
    },
  );

  fetchComments = fetchComments;
  openReportModal = openReportModal;
  reportComment = reportComment;
  openDraftComments = openDraftComments;
  setReaction = setReaction;

  getInitialEditionText = getInitialEditionText;
  saveDraftEditionText = saveDraftEditionText;
  closeEditionForm = closeCommentEditionForm;
  editComment = editComment;

  getInitialReplyText = getInitialReplyText;
  saveDraftReply = saveDraftReply;
  closeReplyForm = closeReplyForm;
  createReply = createReply;
}

export const commentActions = new CommentActions();
